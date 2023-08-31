<template>
  <div>
    <el-divider content-position="left">
      <span style="font-weight: bold; font-size: 20px">
        {{ cronJob.metadata.name }}
      </span></el-divider>
    <!-- 元数据 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 16px">元数据</span>
      </div>
      <List item-layout="horizontal" :split="false">
        <div class="metadata-item">
          <p>名字</p>
          <span>{{ cronJob.metadata.name }}</span>
        </div>
        <div class="metadata-item">
          <p>命名空间</p>
          <span>{{ cronJob.metadata.namespace }}</span>
        </div>
        <div class="metadata-item">
          <p>创建时间</p>
          <span>{{
            cronJob.metadata.creationTimestamp.replaceAll(/[TZ]/g, " ")
          }}</span>
        </div>
        <div class="metadata-item">
          <p>UID</p>
          <span>{{ cronJob.metadata.uid }}</span>
        </div>
      </List>

      <!-- 元数据 标签 注释部分 -->
      <List item-layout="horizontal" :split="false">
        <div
          v-if="labels.length > 0"
          :labels="this.labels"
          class="metadata-item"
        >
          <p>标签</p>
          <li v-for="(label, index) in labels" :key="index">
            <el-tag
              class="lebel-tag"
              effect="dark"
              size="medium"
              color="#bedcfa"
            >{{ label.key }}: {{ label.value }}</el-tag>
          </li>
        </div>
        <br>
        <div
          v-if="annotations.length > 0"
          class="metadata-item"
        >
          <p>注释</p>
          <li v-for="(anno, index) in annotations" :key="index">
            <el-tag
              v-if="anno.value.length > 50"
              id="anno_hover"
              class="lebel-tag"
              effect="dark"
              size="medium"
              color="#bedcfa"
              style="color: #409eff"
              @click="showAnnoDetails(anno.key)"
            >
              {{ anno.key }}
            </el-tag>
            <el-tag
              v-else
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
          <p>调度</p>
          <span>{{ cronJob.spec.schedule }}</span>
        </div>
        <div class="metadata-item">
          <p>运行中的Jobs</p>
          <span>{{ cronJob.status.active.length }}</span>
        </div>
        <div class="metadata-item">
          <p>暂停</p>
          <span>{{ cronJob.spec.suspend === false ? "否" : "是" }}</span>
        </div>
        <div class="metadata-item">
          <p>上次调度</p>
          <span>{{
            cronJob.status.lastScheduleTime.replaceAll(/[TZ]/g, " ")
          }}</span>
        </div>
        <div class="metadata-item">
          <p>并发策略</p>
          <span>{{ cronJob.spec.concurrencyPolicy === 'Allow' ? '允许' : '不允许' }}</span>
        </div>
      </List>
    </el-card>
    <br><br>

    <!-- 运行中的Jobs -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 16px">运行中的任务</span>
      </div>
      <el-table :data="runningJobs" style="width: 100%" stripe>
        <el-table-column width="40">
          <template slot-scope="scope">
            <svg-icon
              :icon-class="
                scope.row.status == '1' ? 'load-success' : 'load-failed'
              "
            />
          </template>
        </el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <router-link
              :to="{
                name: 'Job 详情',
                params: {
                  name: scope.row.name + ',' + scope.row.namespace,
                },
              }"
              class="link-type"
              @click.native="goToJobsDetails(scope.row)"
            >
              <span style="color: #409eff; text-decoration: underline">{{
                scope.row.name
              }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="namespace" label="命名空间" />
        <el-table-column label="容器组" width="200">
          <template slot-scope="scope">
            <span>
              {{ scope.row.runningPods ? scope.row.runningPods : 0 }}/{{
                scope.row.replicas
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="200">
          <template slot-scope="scope">
            <span>{{
              scope.row.creationTimestamp.replaceAll(/[TZ]/g, " ")
            }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              style="margin-bottom: 5px"
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showJobEditDialog(scope.row.name, scope.row.namespace)"
            >编辑</el-button>
            <br>
            <!-- 删除 -->
            <el-button
              style="margin-bottom: 5px"
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="delJob(scope.row.name, scope.row.namespace)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <br><br>

    <!-- 非工作的Jobs -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 16px">非工作的任务  </span>
      </div>
      <el-table :data="jobs" style="width: 100%" stripe>
        <el-table-column width="40">
          <template slot-scope="scope">
            <svg-icon
              :icon-class="
                scope.row.status == '1' ? 'load-success' : 'load-failed'
              "
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称">
          <template slot-scope="scope">
            <router-link
              :to="{
                name: 'Job 详情',
                params: {
                  name: scope.row.name + ',' + scope.row.namespace,
                },
              }"
              class="link-type"
              @click.native="goToJobsDetails(scope.row)"
            >
              <span style="color: #409eff; text-decoration: underline">{{
                scope.row.name
              }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="namespace" label="命名空间" />
        <el-table-column label="容器组" width="200">
          <template slot-scope="scope">
            <span>
              {{ scope.row.runningPods ? scope.row.runningPods : 0 }}/{{
                scope.row.replicas
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="200">
          <template slot-scope="scope">
            <span>{{
              scope.row.creationTimestamp.replaceAll(/[TZ]/g, " ")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              style="margin-bottom: 5px"
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showJobEditDialog(scope.row.name, scope.row.namespace)"
            >编辑</el-button>
            <br>
            <!-- 删除 -->
            <el-button
              style="margin-bottom: 5px"
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="delJob(scope.row.name, scope.row.namespace)"
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

    <!-- anno 详情 -->
    <el-dialog
      :title="annoKey"
      :visible.sync="annoDialogVisible"
      width="50%"
      :modal="false"
      :show-close="true"
      @close="annoHandleClose"
    >
      <highlightjs javascript :code="annoDetails" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="annoDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- Job 编辑框 -->
    <el-dialog
      title="编辑 Job"
      :visible.sync="jobEditDialogVisible"
      width="70%"
      :append-to-body="true"
      :lock-scroll="true"
      @closed="jobHandleClose"
      @close="jobEditDialogVisible = false"
    >
      <el-tabs value="first" type="card">
        <el-tab-pane label="YAML" name="first">
          <codemirror
            :value="jobCodeYaml"
            :options="cmOptionsYaml"
            @ready="onJobYamlCmReady"
            @input="onJobYamlCmCodeChange"
          />
        </el-tab-pane>
        <!-- <el-tab-pane label="JSON" name="second">
          <codemirror
            ref="cmYamlEditor"
            :value="codeJSON"
            :options="cmOptions"
            @ready="onJSONCmReady"
            @input="onJSONCmCodeChange"
          />
        </el-tab-pane> -->
      </el-tabs>

      <!-- <textarea style="width:100%" name="describe" id="pod" cols="30" rows="10">
        {{code}}
      </textarea> -->
      <span slot="footer" class="dialog-footer">
        <div class="foot-info">
          <i class="el-icon-warning" /> 此操作相当于 kubectl apply -f
          &ltspec.yaml>
        </div>
        <el-button @click="jobEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitYamlChange">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/yaml/yaml.js'
// import theme style
import 'codemirror/theme/panda-syntax.css'

export default {
  props: ['name'],
  data() {
    return {
      jobs: [],
      runningJobs: [],
      cronJob: {},
      cronJobName: '',
      cronJobNamespace: '',
      events: [],
      annoKey: '',
      annoDialogVisible: false,
      annoDetails: '',
      jobEditDialogVisible: false, // 编辑详情框
      // codeJSON: "", // 编辑框的 json 数据
      jobCodeYaml: '', // 编辑框的 yaml 数据
      addYaml: '', // 添加框的 yaml 数据

      // cmOptions: {
      //   // json codemirror 配置项
      //   tabSize: 4,
      //   mode: {
      //     name: "javascript",
      //     json: true,
      //   },
      //   theme: "panda-syntax",
      //   lineNumbers: true,
      //   line: true,
      // },
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
    // 元数据中持续的时间
    // duration() {},

    // 元数据下的标签
    labels() {
      const labelArr = []
      for (const pro in this.cronJob.metadata.labels) {
        labelArr.push({
          key: pro,
          value: this.cronJob.metadata.labels[pro]
        })
      }
      return labelArr
    },

    // 元数据下的注释
    annotations() {
      const annoArr = []
      for (const anno in this.cronJob.metadata.annotations) {
        annoArr.push({
          key: anno,
          value: this.cronJob.metadata.annotations[anno]
        })
      }
      return annoArr
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
    // console.log("CronJobDetailes.name and namespace =", nameAndNamespace, "="),
    this.$store
      .dispatch('cronJobs/getCronJobResources', nameAndNamespace)
      .then((res) => {
        console.log(res)
        this.cronJob = res.data.cronJob
        this.runningJobs = res.data.runningJobs
        this.jobs = res.data.jobs
        this.events = res.data.events
      })
      .catch((error) => {
        throw error
      })
  },

  methods: {
    showAnnoDetails(key) {
      this.annoDialogVisible = true
      // console.log(this.cronJob.metadata);
      this.annoKey = key
      this.annoDetails = this.beautify(this.cronJob.metadata.annotations[key], {
        indent_size: 2,
        space_in_empty_paren: true
      })
    },
    annoHandleClose() {
      // console.log(this.annoKey, "inhandleClose");
      this.annoKey = ''
      this.annoDialogVisible = false
    },

    // 编辑 Job
    showJobEditDialog(name, namespace) {
      const jobDetails = {
        name: name,
        namespace: namespace
      }
      // 获取 yaml 格式
      this.$store
        .dispatch('jobs/getJobYamlByNameAndNamespace', jobDetails)
        .then((res) => {
          this.jobCodeYaml = res.data
          this.jobEditDialogVisible = true // 打开编辑对话框
        })
        .catch((error) => {
          throw error
        })
    },

    // 编辑器方法
    /* yaml */
    onJobYamlCmReady(cm) {
      setTimeout(() => {
        cm.refresh()
      }, 50)
    },
    onJobYamlCmCodeChange(newCode) {
      // console.log("onYamlCmCodeChange\n")
      this.jobCodeYaml = newCode
    },

    // 点击确认按钮触发此修改 Job 事件
    commitYamlChange() {
      this.$confirm('确认修改？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
          this.$store
            .dispatch('common/changeResourceByYaml', this.codeYaml)
            .then((res) => {
              switch (res.code) {
                case 1200:
                  this.$message.success('修改成功')
                  break
                case 1201:
                  this.$message.error('修改失败，请查看 yaml 文件')
                  break
                case 1202:
                  this.$message.error('您的操作有误')
                  break
                default:
                  this.$message.info('提交成功')
                  break
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

    // 关闭修改框
    jobHandleClose: function() {
      // console.log("jobHandleClose\n");
      this.addYaml = ''
      setTimeout(() => {
        this.codemorror.refresh()
      }, 1)
    },

    // 删除 Job
    delJob(name, namespace) {
      this.$confirm('确认删除 Job？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const nameAndNamespace = {
            name: name,
            namespace: namespace
          }
          this.$store
            .dispatch('jobs/deleteJobByNameAndNamespace', nameAndNamespace)
            .then((res) => {
              if (res.data) {
                this.$message.success('删除成功')
                this.getJobs()
              } else {
                this.$message.error('删除失败')
              }
              // console.log(res.data);
            })
            .catch((error) => {
              console.log(error)
            })
        })
        .catch(() => {})
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
#anno_hover:hover {
  cursor: pointer;
}
// 编辑窗底部命令提示信息
.foot-info {
  position: absolute;
  margin-bottom: 5px;
  padding: 5px 5px;
  background-color: #ccc;
  left: 0%;
  color: #606266;
  font-size: 15px;
}
</style>
