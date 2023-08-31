<template>
  <div>
    <!-- {{name}}
    {{namespace}} -->
    <el-divider
      content-position="left"
    ><span style="font-weight: bold; font-size: 20px">
      {{ job.metadata.name }}
    </span></el-divider>
    <!-- 元数据 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 16px">元数据</span>
      </div>
      <List item-layout="horizontal" :split="false">
        <div class="metadata-item">
          <p>名字</p>
          <span>{{ job.metadata.name }}</span>
        </div>
        <div class="metadata-item">
          <p>命名空间</p>
          <span>{{ job.metadata.namespace }}</span>
        </div>
        <div class="metadata-item">
          <p>创建时间</p>
          <span>{{
            job.metadata.creationTimestamp.replaceAll(/[TZ]/g, " ")
          }}</span>
        </div>
        <div class="metadata-item">
          <p>UID</p>
          <span>{{ job.metadata.uid }}</span>
        </div>
      </List>
      <!-- 元数据 标签 注释部分 -->
      <List item-layout="horizontal" :split="false">
        <div v-if="labels.length > 0" :labels="this.labels" class="metadata-item">
          <p>标签</p>
          <li v-for="label in labels" :key="label">
            <el-tag
              class="lebel-tag"
              effect="dark"
              size="medium"
              color="#bedcfa"
            >{{ label.key }}: {{ label.value }}</el-tag>
          </li>
        </div>
        <div v-if="annotations.length > 0" :annotation="this.annotations" class="metadata-item">
          <p>注释</p>
          <li v-for="anno in annotations" :key="anno">
            <el-tag
              class="lebel-tag"
              effect="dark"
              size="medium"
              color="#bedcfa"
            >{{ anno.key }}: {{ anno.value }}</el-tag>
          </li>
        </div>
      </List>
    </el-card>
    <br><br>

    <!-- 资源信息 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 16px">资源信息</span>
      </div>
      <List item-layout="horizontal" :split="false">
        <div class="metadata-item">
          <p>共需完成</p>
          <span>{{ job.spec.completions }}</span>
        </div>
        <div class="metadata-item">
          <p>可并行Pod</p>
          <span>{{ job.spec.parallelism }}</span>
        </div>
        <br>
        <div class="metadata-item">
          <p>镜像</p>
          <li
            v-for="container in job.spec.template.spec.containers"
            :key="container"
            style="list-style: none"
          >
            <el-tag
              class="lebel-tag"
              effect="dark"
              size="medium"
              color="#bedcfa"
            >{{ container.image }}</el-tag>
          </li>
        </div>
      </List>
    </el-card>
    <br><br>

    <!-- Pod 状态 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 16px">Pod 状态</span>
      </div>
      <List item-layout="horizontal" :split="false">
        <div v-if="runningPods > 0" :runningPods="this.runningPods" class="metadata-item">
          <p>运行</p>
          <span>{{ runningPods }}</span>
        </div>
        <div v-if="job.status.succeeded" class="metadata-item">
          <p>成功</p>
          <span>{{ job.status.succeeded }}</span>
        </div>
        <div v-if="pendingPods > 0" :pendingPods="this.pendingPods" class="metadata-item">
          <p>启动中</p>
          <span>{{ pendingPods }}</span>
        </div>
        <div class="metadata-item">
          <p>期望</p>
          <span>{{ job.spec.completions }}</span>
        </div>
      </List>
    </el-card>
    <br><br>

    <!-- Pods 列表 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 16px">Pods 列表</span>
      </div>
      <el-table
        v-loading="loading"
        :data="pods"
        style="width: 100%"
        stripe
        element-loading-text="获取数据中..."
      >
        <el-table-column width="40">
          <template slot-scope="scope">
            <svg-icon
              :icon-class="
                scope.row.phase == 'Running' || scope.row.phase == 'Succeeded'
                  ? 'load-success'
                  : 'load-failed'
              "
            /></template>
        </el-table-column>
        <el-table-column prop="name" label="名字">
          <template slot-scope="scope">
            <router-link
              :to="'/workload/pods/' + scope.row.name"
              class="link-type"
              @click.native="
                goToPodsDetails(scope.row.name, scope.row.namespace)
              "
            >
              <span style="color: #409eff; text-decoration: underline">{{
                scope.row.name
              }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="namespace" label="命名空间" />
        <el-table-column prop="phase" label="状态" />
        <el-table-column align="center" prop="restartCount" label="重启次数" />
        <el-table-column align="center" label="CPU 利用率" width="140">
          <template slot-scope="scope">
            <!-- {{ scope.row.cpuUsage }} -->
            <div v-if="scope.row.cpuUsage != -1">
              <div v-if="scope.row.cpuUsage == 0" class="usage-cpu-tag-zero">
                0 m
              </div>
              <div v-else class="usage-cpu-tag-success">
                {{ (scope.row.cpuUsage / 1000 / 1000).toFixed(2) }} m
              </div>
            </div>

            <div v-else class="usage-cpu-tag-failed">--</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="内存利用率" width="140">
          <template slot-scope="scope">
            <!-- {{scope.row.memoryUsage == -1}} -->
            <div v-if="scope.row.memoryUsage != -1">
              <div
                v-if="scope.row.memoryUsage == 0"
                class="usage-memory-tag-zero"
              >
                0 MiB
              </div>
              <div v-else class="usage-memory-tag-success">
                {{ (scope.row.memoryUsage / 1024).toFixed(2) }} MiB
              </div>
            </div>

            <div v-else class="usage-memory-tag-failed">--</div>
          </template>
        </el-table-column>
        <el-table-column prop="nodeName" width="120" label="所属节点" />
        <el-table-column prop="podIP" width="120" label="主机ip地址" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              style="margin-bottom: 5px"
              size="small"
              @click="showPodEditDialog(scope.row.name, scope.row.namespace)"
            >编辑</el-button>
            <br>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="delPod(scope.row.name, scope.row.namespace)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <br><br>

    <!-- 事件 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 16px">事件</span>
      </div>
      <el-table :data="events" style="width: 100%" stripe>
        <el-table-column label="类型" prop="type" width="100" />
        <el-table-column label="原因" prop="reason" width="170" />
        <el-table-column label="时间" width="150">
          <template slot-scope="scope">
            <span>{{
              scope.row.lastTimestamp ? scope.row.lastTimestamp.replaceAll(/[TZ]/g, " ")
              : scope.row.eventTime.time ? scope.row.eventTime.time.replaceAll(/[TZ]/g, " ") :
                "无"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="来自" width="170">
          <template slot-scope="scope">
            <span>
              {{ scope.row.involvedObject.kind + '/' + scope.row.involvedObject.name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="信息" prop="message" width="" />
      </el-table>
    </el-card>
    <br><br>

    <!-- Pod 编辑框 -->
    <el-dialog
      title="编辑 pod"
      :visible.sync="editDialogVisible"
      width="70%"
      :append-to-body="true"
      :lock-scroll="true"
      @closed="handleClose"
      @close="editDialogVisible = false"
    >
      <el-tabs value="first" type="card">
        <el-tab-pane label="YAML" name="first">
          <codemirror
            :value="codeYaml"
            :options="cmOptionsYaml"
            @ready="onYamlCmReady"
            @input="onYamlCmCodeChange"
          />
        </el-tab-pane>
        <el-tab-pane label="JSON" name="second">
          <codemirror
            ref="cmYamlEditor"
            :value="codeJSON"
            :options="cmOptions"
            @ready="onJSONCmReady"
            @input="onJSONCmCodeChange"
          />
        </el-tab-pane>
      </el-tabs>

      <!-- <textarea style="width:100%" name="describe" id="pod" cols="30" rows="10">
        {{code}}
      </textarea> -->
      <span slot="footer" class="dialog-footer">
        <div class="foot-info">
          <i class="el-icon-warning" /> 此操作相当于 kubectl apply -f
          &ltspec.yaml>
        </div>
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitYamlChange">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import language js
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/yaml/yaml.js'
// import theme style
import 'codemirror/theme/panda-syntax.css'

export default {
  props: ['name', 'namespace'],
  data() {
    return {
      pods: {},
      job: {},
      jobName: '',
      jobNamespace: '',
      events: [],
      loading: true,
      editDialogVisible: false,
      codeYaml: '',
      addYaml: '', // 添加框的 yaml 数据

      cmOptions: {
        // json codemirror 配置项
        tabSize: 4,
        mode: {
          name: 'javascript',
          json: true
        },
        theme: 'panda-syntax',
        lineNumbers: true,
        line: true
      },
      cmOptionsYaml: {
        // yaml codemirror 配置项
        tabSize: 4,
        mode: 'yaml',
        theme: 'panda-syntax',
        lineNumbers: true,
        line: true
      }
    }
  },

  computed: {
    // 元数据下的标签
    labels() {
      const labelArr = []
      for (const pro in this.job.metadata.labels) {
        labelArr.push({
          key: pro,
          value: this.job.metadata.labels[pro]
        })
      }
      return labelArr
    },

    // 元数据下的注释
    annotations() {
      const annoArr = []
      for (const anno in this.job.metadata.annotations) {
        annoArr.push({
          key: anno,
          value: this.job.metadata.annotations[anno]
        })
      }
      return annoArr
    },

    // 正在运行的Pods数量
    runningPods() {
      let amount = 0
      for (const i in this.pods) {
        switch (this.pods[i].phase) {
          case 'Running':
            amount += 1
            console.log(this.pods[i].phase, i, this.pods.length)
            break
        }
      }
      return amount
    },

    // 正在启动中的Pods数量
    pendingPods() {
      let amount = 0
      console.log(this.pods)
      for (let i = 0; i < this.pods.length; i++) {
        switch (this.pods[i].phase) {
          case 'Pending':
            amount += 1
            console.log(this.pods[i].phase, i, this.pods.length)
            break
        }
      }
      return amount
    }
  },
  // 生命周期方法
  mounted: function() {
    /* name */
    // // 为空，直接存储
    // if (sessionStorage.getItem("deploymentName") == null) {
    //   sessionStorage.setItem("deploymentName", this.$store.state.deployments.deployment.deploymentName);
    //   this.deploymentName = this.$store.state.deployments.deployment.deploymentName;
    // }
    // // 不为空，且当前 deploymentName 有值，同时和之前的不一样，更新 deploymentName
    // else if (
    //   this.$store.state.deployments.deployment.deploymentName != "" &&
    //   sessionStorage.getItem("deploymentName") != this.$store.state.deployments.deployment.deploymentName
    // ) {
    //   sessionStorage.setItem("deploymentName", this.$store.state.deployments.deployment.deploymentName);
    //   this.deploymentName = this.$store.state.deployments.deployment.deploymentName;
    // }

    // /* namespace */
    // // 为空，直接存储
    // if (sessionStorage.getItem("deploymentNamespace") == null) {
    //   sessionStorage.setItem("deploymentNamespace", this.$store.state.deployments.deployment.deploymentNamespace);
    //   this.deploymentNamespace = this.$store.state.deployments.deployment.deploymentNamespace;
    // }
    // // 不为空，且当前 deploymentNamespace 有值，同时和之前的不一样，更新 deploymentNamespace
    // else if (
    //   this.$store.state.deployments.deployment.deploymentNamespace != "" &&
    //   sessionStorage.getItem("deploymentNamespace") != this.$store.state.deployments.deployment.deploymentNamespace
    // ) {
    //   sessionStorage.setItem("deploymentNamespace", this.$store.state.deployments.deployment.deploymentNamespace);
    //   this.deploymentNamespace = this.$store.state.deployments.deployment.deploymentNamespace;
    // }

    // 获取数据
    const nameAndNamespace = {
      // name: sessionStorage.getItem("deploymentName"),
      // namespace: sessionStorage.getItem("deploymentNamespace"),
      name: this.name.split(',')[0],
      namespace: this.name.split(',')[1]
    }
    this.$store
      .dispatch('jobs/getJobResources', nameAndNamespace)
      .then((res) => {
        console.log(res)
        this.job = res.data.job
        this.pods = res.data.pods
        this.events = res.data.events
        this.loading = false
      })
      .catch((error) => {
        throw error
      })
  },

  methods: {
    /* 编辑部分 */
    showPodEditDialog(name, namespace) {
      const podDetails = {
        podName: name,
        podNamespace: namespace
      }

      // 获取 yaml 格式
      this.$store
        .dispatch('pods/getPodYamlByNameAndNamespace', podDetails)
        .then((res) => {
          // let json = JSON.stringify(res.data);
          // this.codeJSON = this.beautify(json, {
          //   indent_size: 4,
          //   space_in_empty_paren: true,
          // });
          console.log(res, '\n最初获取的Yaml\n')
          this.codeYaml = res.data
          this.editDialogVisible = true // 打开编辑对话框
        })
        .catch((error) => {
          throw error
        })

      // json 格式
      this.$store
        .dispatch('pods/getPodByNameAndNamespace', podDetails)
        .then((res) => {
          // console.log(res);
          const json = JSON.stringify(res.data.pod)
          this.codeJSON = this.beautify(json, {
            indent_size: 4,
            space_in_empty_paren: true
          })
        })
        .catch((error) => {
          throw error
        })

      // this.editForm = res; // 查询结果写入表单
    },

    // 编辑器方法
    /* yaml */
    onYamlCmReady(cm) {
      setTimeout(() => {
        cm.refresh()
      }, 50)
    },
    onYamlCmCodeChange(newCode) {
      this.codeYaml = newCode
    },

    // 提交修改
    commitYamlChange() {
      console.log('提交修改的 yaml', this.codeYaml)
      this.$confirm('确认修改？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
          this.$store
            .dispatch("common/changeResourceByYaml", this.codeYaml)
            .then((res) => {
              switch (res.code) {
                case 1200:
                  this.$message.success("修改成功");
                  break;
                case 1201:
                  this.$message.error('修改失败，请查看 yaml 文件')
                  break
                case 1202:
                  this.$message.error('您的操作有误')
                  break
                default:
                  this.$message.info("提交成功");
                  break;
              }
              this.editDialogVisible = false
            })
            .catch((error) => {
              throw error
            })
        })
        .catch(() => {
          console.log('cancel')
        })
    },

    // 关闭添加或者修改框
    handleClose: function() {
      this.addYaml = ''
      setTimeout(() => {
        this.codemorror.refresh()
      }, 1)
    },

    /* 删除 Pod */
    delPod: function(name, namespace) {
      this.$confirm('确认删除 pod？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const podDetails = {
          podName: name,
          podNamespace: namespace
        }
        this.$store
          .dispatch('pods/delPodByNameAndNamespace', podDetails)
          .then((res) => {
            if (res.code === 1200) {
              this.$message.success('删除成功')
              this.getPods()
            } else {
              this.$message.error('删除失败')
            }
          })
          .catch((error) => {
            throw error
          })
      }).catch(() => {

      })
    },

    // Pod 跳转
    goToPodsDetails(name, namespace) {
      const nameAndNamespace = {
        podName: name,
        podNamespace: namespace
      }
      this.$store.dispatch('pods/toDetails', nameAndNamespace)
    }
  }
}
</script>
<style lang="scss" scoped>
#cpu-usage,
#memory-usage {
  width: 100%;
  height: 250px;
}

.my-card {
  & p {
    display: inline-block;
    font-size: 18px;
    text-align: center;
  }

  & .my-list {
    text-align: center;
    margin: 0 auto;
    & .my-list-item {
      display: inline-block;
      padding: 0 20px;
    }
  }
}

// 元数据
.metadata-item {
  margin: 0 30px 0 0;
  display: inline-block;
  padding: 10px 10px;

  // 小标题
  & p {
    font-size: 14px;
    color: #909399;
  }

  // 小标题下的内容
  & span {
    font-size: 20px;
    color: #303133;
  }

  // 标签列表
  & li {
    display: inline-block;
    // 标签
    & .lebel-tag {
      margin-right: 15px;
      border-radius: 15px;
      margin-top: 5px;
      padding: 2px 8px;
      color: #333;
      border: none;
    }
  }
}
.demo-Circle-custom {
  & h1 {
    color: #3f414d;
    font-size: 28px;
    font-weight: normal;
  }
  & p {
    color: #657180;
    font-size: 14px;
    margin: 10px 0 15px;
  }
  & span {
    display: block;
    padding-top: 15px;
    color: #657180;
    font-size: 14px;
    &:before {
      content: "";
      display: block;
      width: 50px;
      height: 1px;
      margin: 0 auto;
      background: #e0e3e6;
      position: relative;
      top: -15px;
    }
  }
  & span i {
    font-style: normal;
    color: #3f414d;
  }
}

// 底部命令提示信息
.foot-info {
  position: absolute;
  margin-bottom: 5px;
  padding: 5px 5px;
  background-color: #ccc;
  left: 0%;
  color: #606266;
  font-size: 15px;
}

.usage-cpu-tag-success {
  color: white;
  text-align: center;
  background-color: #387c6d;
  border-radius: 10px;
}
.usage-memory-tag-success {
  color: white;
  text-align: center;
  background-color: #28527a;
  border-radius: 10px;
}
.usage-cpu-tag-zero,
.usage-memory-tag-zero {
  color: white;
  text-align: center;
  background-color: #aaa;
  border-radius: 10px;
}
.usage-cpu-tag-failed,
.usage-memory-tag-failed {
  color: #333;
  text-align: center;
  border-radius: 10px;
}
</style>
