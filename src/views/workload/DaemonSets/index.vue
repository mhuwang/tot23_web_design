<template>
  <div>
    <!-- 主体部分 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>视频列表</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="5">
          <!-- 搜索区域 -->
          <el-input
            ref="videoname"
            placeholder="视频列表"
            name="videoname"
            type="text"
            tabindex="1"
            auto-complete="on"
          ></el-input>
          <!-- 搜索按钮
            <el-button
              slot="append"
              size="large"
              icon="el-icon-plus"
              @click="getPods"
            ></el-button> -->
        </el-col>
        <!-- 添加按钮 -->
        <!-- <el-col :span="4">
          <el-button
            type="primary"
            size="large"
            icon="el-icon-plus"
            @click="addDialogVisible = true"
          >
            添加 Pod
          </el-button>
        </el-col> -->
        <el-col :span="4">
          <el-button
            type="primary"
            size="large"
            @click="addDialogVisible = true"
          >
            搜索
          </el-button>
        </el-col>
        <!-- 添加按钮 -->
        <el-col :span="4">
         <el-button
            type="primary"
            size="large"
            icon="el-icon-plus"
            @click="addDialogVisible = true"
          >
            上传
          </el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="loading"
        :data="daemonSetsInCurrentPage"
        style="width: 100%"
        stripe
        element-loading-text="获取数据中..."
      >
        <el-table-column width="40">
          <template slot-scope="scope">
            <svg-icon
              :icon-class="scope.row.status == '0'
                ? 'load-failed'
                : 'load-success'
              "
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称">
          <template slot-scope="scope">
            <router-link
              :to="{
                name: 'DaemonSet Details',
                params: {
                  name:
                    scope.row.name +
                    ',' +
                    scope.row.namespace,
                },
              }"
              class="link-type"
              @click.native="goToDaemonSetsDetails(scope.row)"
            >
              <span style="color: #409eff; text-decoration: underline">{{ scope.row.name }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="namespace" label="命名空间" />
        <el-table-column label="Pods">
          <template slot-scope="scope">
            <span>
              {{ scope.row.runningPods }}/{{ scope.row.replicas }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="启动时间" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.creationTimestamp.replaceAll(/[TZ]/g, " ") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 日志 -->
            <el-button
              type="info"
              icon="el-icon-document"
              style="margin-bottom: 5px"
              size="small"
              @click="showLogDialog(scope.row.name, scope.row.namespace)"
            >日志</el-button>
            <br>
            <!-- 修改 -->
            <el-button
              style="margin-bottom: 5px"
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="
                showDaemonSetEditDialog(
                  scope.row.name,
                  scope.row.namespace
                )
              "
            >编辑</el-button>
            <br>
            <!-- 删除 -->
            <el-button
              style="margin-bottom: 5px"
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="
                delDaemonSet(
                  scope.row.name,
                  scope.row.namespace
                )
              "
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        layout=" prev, pager, next, jumper, ->, total, slot"
        :total="daemonSetsAmount"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 日志 -->
    <el-dialog
      title="日志"
      :visible.sync="logDialogVisible"
      width="70%"
      :append-to-body="true"
      :lock-scroll="true"
      @close="logDialogClose"
    >
      <template>
        <el-select v-model="podName" placeholder="请选择容器组" style="margin-right: 5px" @change="logSelectChange">
          <el-option
            v-for="item in podNames"
            :key="item"
            :label="item"
            :value="item"
            :disabled="item === podName"
          />
        </el-select>
      </template>
      <template>
        <el-select v-model="containerName" placeholder="请选择容器" @change="logSelectChange">
          <el-option
            v-for="item in containerNames"
            :key="item"
            :label="item"
            :value="item"
            :disabled="item === containerName"
          />
        </el-select>
      </template>
      <highlightjs javascript :code="log" />
      <span slot="footer" class="dialog-footer">
        <div class="foot-info">
          <i class="el-icon-warning" /> 请选择要查看日志的 容器组 和 容器组中的容器
        </div>
        <el-button type="primary" @click="logDialogClose">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑框 -->
    <el-dialog
      title="编辑 DaemonSet"
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
  name: 'DaemonSets',

  data() {
    return {
      /** 基础信息*/
      daemonSets: [], // 所有 DaemonSets
      loading: true, // 获取数据中
      /** 分页部分*/
      daemonSetsAmount: 0, // DaemonSets 总数
      currentPage: 1, // 分页绑定当前页
      daemonSetsInCurrentPage: [], // 页面中的 DaemonSets
      pageSize: 6, // 一页显示数量
      /** 命名空间部分*/
      value: '',
      namespaces: [], // 命名空间
      /** 日志部分*/
      logs: {},
      log: '',
      podName: '',
      containerName: '',
      logDialogVisible: false,
      cmOptionsLog: {
        // 日志 codemirror 配置项
        tabSize: 4,
        mode: 'log',
        theme: 'panda-syntax',
        lineNumbers: true,
        line: true
      },
      /** 编辑框部分*/
      codeYaml: '', // 编辑框的 yaml 数据
      editDialogVisible: false, // 编辑详情框
      cmOptionsYaml: {
        // yaml codemirror 配置项
        tabSize: 4,
        mode: 'yaml',
        theme: 'panda-syntax',
        lineNumbers: true,
        line: true
      },
      /** 添加框部分*/
      addDialogVisible: false, // 添加框详情
      addYaml: '' ,// 添加框的 yaml 数据
      videoname:''
    }
  },

  computed: {
    //搜索
    getVideoname(){
      const pictureSelect = {
        videoname: this,
        types: ''
      }
      this.$store
        .dispatch('daemonSets/getVideoname',pictureSelect)
        .then((res) => {
          console.log(res.data.message)

        })
        .catch((error) => {
          console.log(error)
        
        })
      this.loading = false
    },
    /** 日志部分*/
    podNames() {
      const names = []
      const tmp = Object.keys(this.logs)
      for (const name in tmp) {
        names.push(tmp[name])
      }
      return names
    },
    containerNames() {
      const pod = this.logs[this.podName]
      const names = []
      for (const name in pod) {
        names.push(name)
      }
      return names
    }
  },

  created() {
    // this.getDaemonSets()
  },

  methods: {
    /** 基础*/
    // 获取所有 DaemonSets
    getDaemonSets(namespace = '') {
      this.$store
        .dispatch('daemonSets/getAllDaemonSets', namespace)
        .then((res) => {
          console.log(res.data.message)
          this.daemonSets = res.data
          this.daemonSetsAmount = this.daemonSets.length
          this.daemonSetsInCurrentPage = this.daemonSets.slice(0, this.pageSize)
        })
        .catch((error) => {
          this.daemonSets = []
          this.daemonSetsAmount = 0
          this.daemonSetsInCurrentPage = []
          console.log(error)
        })
      this.loading = false
    },

    /** 按命名空间查询 */
    // 当选择框聚焦时获取命名空间
    initNamespace() {
      if (this.namespaces.length === 0) {
        this.namespaces = this.$store.state.namespaces.namespaces
      }
    },
    // 选择框变化事件
    selectChange(value) {
      // console.log("selectChange", value, "++++\n\n")
      this.loading = true
      this.getDaemonSets(value)
    },
    // 选择框清空事件
    clearSelect() {
      this.loading = true
      this.getDaemonSets()
    },

    /** 日志部分*/
    showLogDialog(name, namespace) {
      const data = {
        name: name,
        namespace: namespace
      }
      this.$store.dispatch('daemonSets/getDaemonSetLogs', data).then(res => {
        console.log(res.data.message)
        this.logs = res.data
        if (Object.keys(this.logs).length !== 0) {
          this.podName = Object.keys(this.logs)[0]
          this.containerName = Object.keys(this.logs[this.podName])[0]
          this.log = this.logs[this.podName][this.containerName]
        }
        this.logDialogVisible = true
      }).catch(error => {
        throw error
      })
    },
    logSelectChange() {
      this.log = this.logs[this.podName][this.containerName]
    },
    logDialogClose() {
      this.logDialogVisible = false
      this.logs = {}
      this.podName = ''
      this.containerName = ''
      this.log = ''
    },

    /** 编辑部分*/
    // 编辑 DaemonSet
    showDaemonSetEditDialog(name, namespace) {
      const daemonSetDetails = {
        name: name,
        namespace: namespace
      }
      // 获取 yaml 格式
      this.$store
        .dispatch(
          'daemonSets/getDaemonSetYamlByNameAndNamespace',
          daemonSetDetails
        )
        .then((res) => {
          console.log(res.data.message)
          this.codeYaml = res.data
          this.editDialogVisible = true // 打开编辑对话框
        })
        .catch((error) => {
          throw error
        })
    },
    // 编辑器方法
    onYamlCmReady(cm) {
      setTimeout(() => {
        cm.refresh()
      }, 50)
    },
    onYamlCmCodeChange(newCode) {
      this.codeYaml = newCode
    },
    // 点击确认按钮触发此修改 DaemonSet 事件
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
    handleClose: function() {
      this.addYaml = ''
      setTimeout(() => {
        this.codemorror.refresh()
      }, 1)
    },

    /** 删除部分*/
    // 删除 DaemonSet
    delDaemonSet(name, namespace) {
      this.$confirm('确认删除 DaemonSet', {
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
            .dispatch(
              'daemonSets/deleteDaemonSetByNameAndNamespace',
              nameAndNamespace
            )
            .then((res) => {
              switch (res.code) {
                case 1200:
                  this.$message.success('删除成功')
                  break
                case 1201:
                  this.$message.error('删除失败')
                  break
                case 1202:
                  this.$message.error('您的操作有误')
                  break
                default:
                  this.$message.info('提交成功')
                  break
              }
              console.log(res.data.message)
            })
            .catch((error) => {
              console.log(error)
            })
        })
        .catch(() => {})
    },

    /** 分页部分*/
    // 分页事件
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.daemonSetsInCurrentPage = this.daemonSets.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      )
    }
  }
}
</script>

<style lang="scss" scoped>
//el-table中资源表格和查找框的分割线
.el-table {
  margin: 15px 0px;
  border-top: 1px solid #ccc;
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
