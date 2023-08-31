<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>其他列表</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <!-- 搜索区域 -->
          <el-input
            ref="othername"
            placeholder="文件名称"
            name="othername"
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
        :data="currentPods"
        style="width: 100%"
        stripe
        v-loading="loading"
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
        <el-table-column prop="name" label="名称">
          <template slot-scope="scope">
            <router-link
              :to="'/workload/pods/' + scope.row.name"
              @click.native="
                goToPodsDetails(scope.row.name, scope.row.namespace)
              "
              class="link-type"
            >
              <span style="color: #409eff; text-decoration: underline">{{
                scope.row.name
              }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="namespace" label="命名空间"> </el-table-column>
        <el-table-column prop="phase" label="状态"> </el-table-column>
        <el-table-column align="center" prop="restartCount" label="重启次数">
        </el-table-column>
        <el-table-column align="center" label="CPU 利用量" width="140">
          <template slot-scope="scope">
            <div v-if="scope.row.cpuUsage != -1">
              <div class="usage-cpu-tag-zero" v-if="scope.row.cpuUsage == 0">
                0 m
              </div>
              <div class="usage-cpu-tag-success" v-else>
                {{ (scope.row.cpuUsage / 1000 / 1000).toFixed(2) }} m
              </div>
            </div>

            <div class="usage-cpu-tag-failed" v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="内存利用量" width="140">
          <template slot-scope="scope">
            <!-- {{scope.row.memoryUsage == -1}} -->
            <div v-if="scope.row.memoryUsage != -1">
              <div
                class="usage-memory-tag-zero"
                v-if="scope.row.memoryUsage == 0"
              >
                0 MiB
              </div>
              <div class="usage-memory-tag-success" v-else>
                {{ (scope.row.memoryUsage / 1024).toFixed(2) }} MiB
              </div>
            </div>

            <div class="usage-memory-tag-failed" v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column prop="nodeName" width="120" label="所属节点">
        </el-table-column>
        <el-table-column prop="podIP" width="120" label="容器ip地址">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">

            <!-- 日志 -->
            <el-button
              type="info"
              icon="el-icon-document"
              style="margin-bottom: 5px"
              size="small"
              @click="showPodLogDialog(scope.row.name, scope.row.namespace)"
            >日志</el-button
            >
            <br >

            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              style="margin-bottom: 5px"
              size="small"
              @click="showPodEditDialog(scope.row.name, scope.row.namespace)"
              >编辑</el-button
            >
            <br >

            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="delPod(scope.row.name, scope.row.namespace)"
              >删除</el-button
            >

          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-size="6"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 日志 -->
    <el-dialog
      title="日志"
      :visible.sync="logDialogVisible"
      width="70%"
      @close="logDialogClose"
      :append-to-body="true"
      :lock-scroll="true"
    >
      <el-tabs type="card">
        <el-tab-pane :label="item"  v-for="item in Object.keys(logs)" :key="item">
<!--          <codemirror-->
<!--            :value="item.log"-->
<!--            :options="cmOptionsLog"-->
<!--          />-->
          <highlightjs javascript :code="logs[item]" />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <div class="foot-info">
          <i class="el-icon-warning"></i> 请选择要查看日志的容器
        </div>
        <el-button type="primary" @click="logDialogClose">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑框 -->
    <el-dialog
      title="编辑 pod"
      :visible.sync="editDialogVisible"
      width="70%"
      @closed="handleClose"
      @close="editDialogVisible = false"
      :append-to-body="true"
      :lock-scroll="true"
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
      </el-tabs>


      <!-- <textarea style="width:100%" name="describe" id="pod" cols="30" rows="10">
        {{code}}
      </textarea> -->
      <span slot="footer" class="dialog-footer">
        <div class="foot-info">
          <i class="el-icon-warning"></i> 此操作相当于 kubectl apply -f
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
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/yaml/yaml.js";
// import theme style
import "codemirror/theme/panda-syntax.css";

export default {
  name: 'Pods',

  data() {
    return {
      /* 日志部分*/
      logs: [],
      logDialogVisible: false,
      cmOptionsLog: {
        // yaml codemirror 配置项
        tabSize: 4,
        mode: 'log',
        theme: 'panda-syntax',
        lineNumbers: true,
        line: true,
      },
      pods: [], // pod 列表
      total: 0, // 总 pod 数
      currentPods: [], // 当前页面的 pod

      namespaces: [], // 命名空间选择框
      value: "", // 选择框的值
      loading: true, // 获取数据中
      editDialogVisible: false, // 编辑详情框
      codeYaml: "", // 编辑框的 yaml 数据
      cmOptionsYaml: {
        // yaml codemirror 配置项
        tabSize: 4,
        mode: "yaml",
        theme: "panda-syntax",
        lineNumbers: true,
        line: true,
      },
    };
  },

  mounted() {
    this.getPods();
  },

  computed: {},

  methods: {

    // 处理分页
    handleCurrentChange(page) {
      this.currentPods = this.pods.slice((page - 1) * 6, page * 6);
    },
    // 编辑器方法
    /* yaml */
    onYamlCmReady(cm) {
      setTimeout(() => {
        cm.refresh();
      }, 50);
    },

    onYamlCmCodeChange(newCode) {
      this.codeYaml = newCode;
    },

    // 获取所有 pods
    getPods(namespace = "") {
      this.$store
        .dispatch("pods/getAllPods", namespace)
        .then((res) => {
          // console.log(res);
          this.pods = res.data;
          this.total = res.data.length;
          this.currentPods = res.data.slice(0, 6);
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 前往 pods 详情页
    goToPodsDetails(name, namespace) {
      let podDetails = {
        podName: name,
        podNamespace: namespace,
      };
      this.$store.dispatch("pods/toDetails", podDetails);
    },

    /** 日志部分 */
    showPodLogDialog(name, namespace) {
      const data = {
        podName: name,
        podNamespace: namespace
      }
      // 获取所有容器的日志信息
      this.$store
        .dispatch('pods/getPodAllLogs', data)
        .then((res) => {
          console.log(res)
          this.logs = res.data
          this.logDialogVisible = true // 打开编辑对话框
        })
        .catch((error) => {
          throw error
        })
    },
    logDialogClose() {
      this.logDialogVisible = false
      this.logs = {}
    },

    /* 编辑部分 */
    showPodEditDialog(name, namespace) {
      let podDetails = {
        podName: name,
        podNamespace: namespace,
      };


      // 获取 yaml 格式
      this.$store
        .dispatch("pods/getPodYamlByNameAndNamespace", podDetails)
        .then((res) => {
          // let json = JSON.stringify(res.data);
          // this.codeJSON = this.beautify(json, {
          //   indent_size: 4,
          //   space_in_empty_paren: true,
          // });
          // console.log(res, "\n最初获取的Yaml\n");
          this.codeYaml = res.data;
          this.editDialogVisible = true; // 打开编辑对话框
        })
        .catch((error) => {
          throw error;
        });

      // json 格式
      // this.$store
      //   .dispatch("pods/getPodByNameAndNamespace", podDetails)
      //   .then((res) => {
      //     // console.log(res);
      //     let json = JSON.stringify(res.data.pod);
      //     this.codeJSON = this.beautify(json, {
      //       indent_size: 4,
      //       space_in_empty_paren: true,
      //     });
      //   })
      //   .catch((error) => {
      //     throw error;
      //   });

      //this.editForm = res; // 查询结果写入表单
    },

    // 提交修改
    commitYamlChange() {
      // console.log("提交修改的 yaml", this.codeYaml);
      this.$confirm("确认修改？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
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
              this.editDialogVisible = false;
            })
            .catch((error) => {
              throw error;
            });
        })
        .catch(() => {
          console.log("cancel");
        });
    },

    // 关闭添加或者修改框
    handleClose: function () {
      this.addYaml = "";
      setTimeout(() => {
        this.codemorror.refresh();
      }, 1);
    },

    /* 删除 Pod */
    delPod: function (name, namespace) {
      this.$confirm("确认删除 pod？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let podDetails = {
            podName: name,
            podNamespace: namespace,
          };
          this.$store
            .dispatch("pods/delPodByNameAndNamespace", podDetails)
            .then((res) => {
              if (res.code == 1200) {
                this.$message.success("删除成功");
                this.getPods();
              } else {
                this.$message.error("删除失败");
              }
            })
            .catch((error) => {
              throw error;
            });
        })
        .catch(() => {});
    },

    /* 按命名空间查询 */

    // 当选择框聚焦时获取命名空间
    initNamespace() {
      if (this.namespaces.length == 0) {
        this.namespaces = this.$store.state.namespaces.namespaces;
      }
    },
    // 选择框变化事件
    selectChange(value) {
      this.loading = true;
      this.getPods(value);
    },
    // 选择框清空事件
    clearSelect() {
      this.loading = true;
      this.getPods();
    },
  },
};
</script>

<style lang="scss" scoped>
$cpu-usage-background: #aaa;

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

.el-table {
  margin: 15px 0px;
  border-top: 1px solid #ccc;
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
