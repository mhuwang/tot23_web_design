<template>
  <div>
    <!-- 主体部分 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文档列表</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="5">
          <!-- 搜索区域 -->
          <el-input
            ref="documentname"
            placeholder="文档名称"
            name="documentname"
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
        :data="deploymentsInCurrentPage"
        style="width: 100%"
        stripe
        element-loading-text="获取数据中..."
      >
        <el-table-column width="40">
          <template slot-scope="scope">
            <svg-icon
              :icon-class="
                scope.row.status === '1' ? 'load-success' : 'load-failed'
              "
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称">
          <template slot-scope="scope">
            <!-- 具有别名 -->
            <el-popover
              v-if="scope.row.alias"
              placement="right-start"
              title="别名"
              width="200"
              trigger="hover"
              :content="scope.row.name">
              <router-link
              slot="reference"
              :to="{
                name: 'Deployment 详情',
                params: { name: scope.row.name + ',' + scope.row.namespace },
              }"
              class="link-type"
              @click.native="
                goToDeploymentsDetails(scope.row.name, scope.row.namespace)
              "
            >
              <span style="color: #409eff; text-decoration: underline">{{
                scope.row.alias
              }}</span>
            </router-link>
            </el-popover>
            <!-- 不具有别名 -->
            <router-link
              v-if="!scope.row.alias"
              :to="{
                name: 'Deployment 详情',
                params: { name: scope.row.name + ',' + scope.row.namespace },
              }"
              class="link-type"
              @click.native="
                goToDeploymentsDetails(scope.row.name, scope.row.namespace)
              "
            >
              <span style="color: #409eff; text-decoration: underline">{{
                scope.row.name
              }}</span>
            </router-link>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="apiVersion" label="版本"> </el-table-column> -->
        <el-table-column prop="namespace" label="命名空间" />
        <el-table-column label="Pods">
          <template slot-scope="scope">
            <span> {{ scope.row.runningPods }}/{{ scope.row.replicas }} </span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="标签">
          <template slot-scope="scope">
            <span
              v-for="(item, index) in scope.row.metadata.labels"
              :key="index"
            >
              {{ scope.row.metadata.labels }}
            </span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="apiVersion" label="apiVersion"> </el-table-column> -->
        <!-- <el-table-column prop="kind" label="kind"> </el-table-column> -->
        <!-- <el-table-column prop="metadata.uid" label="uid"> </el-table-column> -->
        <!-- <el-table-column prop="spec.nodeName" width="140" label="所属节点"> </el-table-column>
        <el-table-column prop="status.podIP" width="140" label="主机ip地址"> </el-table-column> -->
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
              @click="
                showDeploymentEditDialog(scope.row.name, scope.row.namespace)
              "
            >编辑</el-button>
            <br>
            <!-- 删除 -->
            <el-button
              style="margin-bottom: 5px"
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="delDeployment(scope.row.name, scope.row.namespace)"
            >删除</el-button>
            <br>
            <el-button
              type="warning"
              icon="el-icon-document-copy"
              size="small"
              @click="setReplica(scope.row.name, scope.row.namespace)"
            >副本</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        layout=" prev, pager, next, jumper, ->, total, slot"
        :total="deploymentsAmount"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- Deployment 编辑窗 -->
    <el-dialog
      title="编辑 Deployment"
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
    <span>aaaa</span>
  </div>
</template>

<script>
// import language js
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/yaml/yaml.js'
// import theme style
import 'codemirror/theme/panda-syntax.css'

export default {
  name: 'Deployments',

  data() {
    return {
      /** 基础*/
      deploymentsAmount: 0, // Deployments 总数
      loading: true, // 获取数据中
      /** 命名空间*/
      namespaces: [],
      value: '',
      /** 分页*/
      currentPage: 1, // 分页绑定当前页
      deploymentsInCurrentPage: [], // 页面中的 Deployments
      pageSize: 6, // 一页显示数量
      deployments: [],
      /** 编辑*/
      editDialogVisible: false, // 编辑详情框
      addDialogVisible: false, // 添加框详情
      codeYaml: '', // 编辑框的 yaml 数据
      addYaml: '', // 添加框的 yaml 数据
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

  created() {
    this.getDeployments()
  },

  methods: {
    /** 基础*/
    // 详情页
    goToDeploymentsDetails: function(deploymentName, deploymentNamespace) {
      this.$store.dispatch('deployments/toDetails', {
        deploymentName,
        deploymentNamespace
      })
    },
    // 获取所有 Deployments
    getDeployments(namespace = '') {
      this.$store
        .dispatch('deployments/getAllDeployments', namespace)
        .then((res) => {
          console.log(res)
          this.deployments = res.data
          this.deploymentsAmount = this.deployments.length
          this.deploymentsInCurrentPage = this.deployments.slice(
            0,
            this.pageSize
          )
        })
        .catch((error) => {
          console.log(error)
          this.deployments = []
          this.deploymentsAmount = 0
          this.deploymentsInCurrentPage = []
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
      this.loading = true
      this.getDeployments(value)
    },
    // 选择框清空事件
    clearSelect() {
      this.loading = true
      this.getDeployments()
    },

    /** 编辑*/
    // 编辑 Deployment
    showDeploymentEditDialog(name, namespace) {
      const deploymentDetails = {
        name: name,
        namespace: namespace
      }
      // 获取 yaml 格式
      this.$store
        .dispatch(
          'deployments/getDeploymentYamlByNameAndNamespace',
          deploymentDetails
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
    /* yaml */
    onYamlCmReady(cm) {
      setTimeout(() => {
        cm.refresh()
      }, 50)
    },
    onYamlCmCodeChange(newCode) {
      this.codeYaml = newCode
    },
    // 点击确认按钮触发此修改 Deployment 事件
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

    /** 副本*/
    setReplica(name, namespace) {
      this.$prompt('请输入副本数', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[0-9]+$/,
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: "请输入数字",
      })
        .then(({ value }) => {
          const data = {
            replica: value,
            name: name,
            namespace: namespace
          }
          this.$store.dispatch('deployments/setReplica', data).then((res) => {
            switch (res.code) {
              case 1200:
                this.$message.success('设置成功')
                break
              case 1201:
                this.$message.error('设置失败')
                break
              case 1202:
                this.$message.error('您的操作有误')
                break
              default:
                this.$message.info('提交成功')
                break
            }
            this.getDeployments()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    },

    /** 删除*/
    // 删除 Deployment
    delDeployment(name, namespace) {
      this.$confirm('确认删除 Deployment？', {
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
              'deployments/deleteDeploymentByNameAndNamespace',
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

    /** 分页*/
    // 分页事件
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.deploymentsInCurrentPage = this.deployments.slice(
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
