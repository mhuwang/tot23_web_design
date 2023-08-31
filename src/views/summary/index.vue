<template>
  <div>
    <!-- 集群拓扑图 -->
    <el-card class="box-card">
      <div ref="chart" style="height: 700px; width: 100%"></div>
    </el-card>
    <br />
    <!-- 节点信息 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 20px">节点信息</span>
      </div>
      <el-table :data="nodes" style="width: 100%" stripe>
        <el-table-column width="40">
          <template slot-scope="scope">
            <svg-icon
              :icon-class="
                scope.row.status == 'True'
                  ? 'load-success'
                  : scope.row.status == 'Unknown'
                  ? 'load-doubt'
                  : 'load-failed'
              "
            />
          </template>
        </el-table-column>
        <el-table-column label="名称" width="180">
          <template slot-scope="scope">
            <router-link
              :to="'/summary/nodes/' + scope.row.name"
              @click.native="goToNodeDetails(scope.row.name)"
              class="link-type"
            >
              <span style="color: #409eff; text-decoration: underline">{{
                scope.row.name
              }}</span>
            </router-link>
          </template>
        </el-table-column>
        <!-- <el-table-column label="标签">
          <template slot-scope="scope">
            <span>k8s-app: {{scope.row.metadata.labels['k8s-app']}}</span>
            <br>
            <span>pod-template-hash: {{scope.row.metadata.labels['pod-template-hash']}}</span>
          </template>
        </el-table-column> -->
        <el-table-column width="100" label="就绪状态">
          <template slot-scope="scope">
            {{
              scope.row.status == "True"
                ? "就绪"
                : scope.row.status == "Unknown"
                ? "未知"
                : "失败"
            }}
          </template>
        </el-table-column>
        <el-table-column label="CPU 利用率" width="200">
          <template slot-scope="scope">
            <el-progress
              class="my-progress"
              color="#fc8621"
              :text-inside="true"
              :stroke-width="20"
              :percentage="scope.row.cpuUsage.toFixed(2) * 1"
            ></el-progress>
          </template>
        </el-table-column>
        <el-table-column label="内存利用率" width="200">
          <template slot-scope="scope">
            <el-progress
              class="my-progress"
              color="#c24914"
              :text-inside="true"
              :stroke-width="20"
              :percentage="scope.row.memoryUsage.toFixed(2) * 1"
            ></el-progress>
          </template>
        </el-table-column>

        <el-table-column
          prop="node.metadata.creationTimestamp"
          label="创建时间"
          sortable :sort-by="timeSort"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.time.replaceAll(/[TZ]/g, " ") }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="是否可调度" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.schedule"
              @change="changeSchedule(scope.row.name)"
            ></el-switch>
          </template>
        </el-table-column> -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              style="margin-bottom: 5px"
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showNodeEditDialog(scope.row.name)"
              >编辑</el-button
            >
            <br />
            <!-- 删除 -->
            <!-- <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="delNode(scope.row.name)"
              >删除</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <br />
    <!-- 命名空间 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 20px">命名空间</span>
      </div>
      <el-table :data="currentNamespaces" style="width: 100%" stripe>
        <el-table-column width="40">
          <template slot-scope="scope">
            <svg-icon
              :icon-class="scope.row.status ? 'load-success' : 'load-failed'"
            />
          </template>
        </el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <router-link
              :to="'/summary/namespaces/' + scope.row.name"
              @click.native="goToNamespacesDetails(scope.row)"
              class="link-type"
            >
              <span style="color: #409eff; text-decoration: underline">{{
                scope.row.name
              }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="phase" label="运行阶段">
          <template slot-scope="scope">
            {{ scope.row.status ? "运行" : "终止" }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" sortable :sort-by="timeSort">
          <template slot-scope="scope">
            <span>{{ scope.row.time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              style="margin-bottom: 5px"
              size="small"
              @click="showNamespaceEditDialog(scope.row.name)"
              >编辑</el-button
            ><br />
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="delNamespace(scope.row.name)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @current-change="handleNamespaceCurrentChange"
        :current-page="1"
        :page-size="6"
        layout="total, prev, pager, next, jumper"
        :total="totalNamespace"
      >
      </el-pagination>
    </el-card>
    <br />
    <!-- 集群角色 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 20px">集群角色</span>
      </div>
      <el-table :data="currentClusterRoles" style="width: 100%" stripe>
        <!-- <el-table-column width="40">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.status.phase == 'Active'? 'load-success': 'load-failed'"/>
          </template>
        </el-table-column> -->
        <el-table-column label="名称">
          <template slot-scope="scope">
            <router-link
              :to="'/summary/clusterRoles/' + scope.row.name"
              @click.native="goToClusterRolesDetails(scope.row)"
              class="link-type"
            >
              <span style="color: #409eff; text-decoration: underline">{{
                scope.row.name
              }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" sortable :sort-by="timeSort">
          <template slot-scope="scope">
            <span>{{ scope.row.time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              style="margin-bottom: 5px"
              size="small"
              @click="showClusterRolesEditDialog(scope.row.name)"
              >编辑</el-button
            ><br />
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="delClusterRole(scope.row.name)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @current-change="handleClusterRolesCurrentChange"
        :current-page="1"
        :page-size="6"
        layout="total, prev, pager, next, jumper"
        :total="totalClusterRoles"
      >
      </el-pagination>
    </el-card>

    <!-- 编辑框 Node -->
    <el-dialog
      title="编辑 Node"
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
      <span slot="footer" class="dialog-footer">
        <div class="foot-info">
          <i class="el-icon-warning"></i> 此操作相当于 kubectl apply -f
          &ltspec.yaml>
        </div>
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitYamlChange">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑框 Namespace-->
    <el-dialog
      title="编辑 namespace"
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
      <span slot="footer" class="dialog-footer">
        <div class="foot-info">
          <i class="el-icon-warning"></i> 此操作相当于 kubectl apply -f
          &ltspec.yaml>
        </div>
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitYamlChange">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑框 ClusterRole-->
    <el-dialog
      title="编辑 clusterRole"
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

      <!-- <textarea style="width:100%" name="describe" id="ingress" cols="30" rows="10">
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
  components: {},
  data() {
    return {
      
      /* 节点部分 */
      nodes: [],
      
      /* 命名空间部分 */
      namespaces: [],
      currentNamespaces: [],
      totalNamespace: 0,
      /* 集群角色部分 */
      clusterRoles: [],
      currentClusterRoles: [],
      totalClusterRoles: 0,
      /* 公共部分 */
      editDialogVisible: false,
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
  // 初始化方法
  created: function () {
    this.getAllNodes();
    this.getAllNamespaces();
    this.getAllClusterRoles();
  },
  mounted: function () {
    this.initEchart();
  },
  methods: {
    // 初始化图
    initEchart: function () {
      let self = this;
      this.$store
        .dispatch("cluster/initClusterGraph")
        .then((res) => {
          console.log(res);
          const chart = this.$refs.chart;
          if (chart) {
            const myChart = this.$echarts.init(chart);
            let option = {
              title: {
                text: "集群节点拓扑图",
                top: "top",
                left: "center",
              },
              tooltip: {
                formatter: (params) => {
                  if (params.dataType == "node") {
                    if (params.name == "Pod") {
                      return (
                        "<strong>name:</strong> " +
                        params.data.value +
                        "<br/>" +
                        "<strong>namespace:</strong> " +
                        params.data.namespace
                      );
                    } else {
                      return "<strong>name:</strong> " + params.value;
                    }
                  } else {
                    let a = res.data.nodes.filter((node) => {
                      return node.id == params.data.source;
                    });
                    let b = res.data.nodes.filter((node) => {
                      return node.id == params.data.target;
                    });
                    return b[0].value + " > " + a[0].value;
                  }
                },
              },
              legend: [
                {
                  orient: "vertical",
                  left: "5%",
                  top: "10%",
                  data: res.data.categories.map((a) => a.name),
                },
              ],
              // animationDuration: 1500,
              // animationEasingUpdate: "quinticInOut",
              series: [
                {
                  type: "graph",
                  layout: "none",
                  data: res.data.nodes,
                  links: res.data.links,
                  categories: res.data.categories,
                  legendHoverLink: false,
                  zoom: 1,
                  roam: true,
                  center: [0, 0],
                  label: {
                    show: true,
                    position: "right",
                    formatter: function (params) {
                      switch (params.name) {
                        case "Pod":
                          return "容器";
                        case "Master Node":
                          return "主节点";
                        case "Node":
                          return "节点";
                      }
                    },
                  },
                  lineStyle: {
                    color: "source",
                    curveness: 0.3,
                  },
                  emphasis: {
                    scale: true,
                    focus: "adjacency",
                    blurScope: "global",
                    lineStyle: {
                      width: 10,
                    },
                  },
                  animation: true,
                  labelLayout: {
                    hideOverlap: true,
                  },
                },
              ],
            };
            myChart.setOption(option, null, { renderer: "svg" });
            myChart.on("click", function (params) {
              if (params.dataType === "node") {
                // 点击节点
                if (params.name === "Master Node" || params.name === "Node") {
                  self.$store.dispatch("nodes/toDetails", params.value);
                  self.$router.push("/summary/nodes/" + params.value);
                } else if (params.name === "Edge Node") {
                  self.$store.dispatch("edge/toDetails", params.value);
                  self.$router.push("/edge/edgenodes/" + params.value);
                } else {
                  let podDetails = {
                    podName: params.value,
                    podNamespace: params.data.namespace,
                  };
                  self.$store.dispatch("pods/toDetails", podDetails);
                  self.$router.push("/workload/pods/" + params.value);
                }
              } else if (params.dataType === "edge") {
                // 点击连接线
                console.log("click edge");
              } else {
                console.log("click");
              }
            });
          }
        })
        .catch((error) => {
          throw error;
        });
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
    // 获取 node 节点详情页
    goToNodeDetails: function (nodeName) {
      this.$store.dispatch("nodes/toDetails", nodeName);
    },
    // 获取命名空间详情页
    goToNamespacesDetails: function (namespaceDetails) {
      this.$store.dispatch("namespaces/toDetails", namespaceDetails);
    },
    // 获取集群角色详情页
    goToClusterRolesDetails: function (clusterRoles) {
      this.$store.dispatch("clusterRoles/toDetails", clusterRoles);
    },
    // 获取所有节点信息
    getAllNodes: function () {
      this.$store
        .dispatch("nodes/getAllNodes")
        .then((res) => {
          console.log(res);
          this.nodes = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 获取所有命名空间
    getAllNamespaces: function () {
      this.$store
        .dispatch("namespaces/getAllNamespaces")
        .then((res) => {
          console.log(res);
          this.namespaces = res.data;
          this.totalNamespace = res.data.length;
          this.currentNamespaces = res.data.slice(0, 6);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 处理命名空间分页
    handleNamespaceCurrentChange(page) {
      this.currentNamespaces = this.namespaces.slice((page - 1) * 6, page * 6);
    },
    // 获取所有集群角色
    getAllClusterRoles: function () {
      this.$store
        .dispatch("clusterRoles/getAllClusterRoles")
        .then((res) => {
          console.log(res);
          this.clusterRoles = res.data;
          this.totalClusterRoles = res.data.length;
          this.currentClusterRoles = res.data.slice(0, 6);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 处理集群角色分页
    handleClusterRolesCurrentChange(page) {
      this.currentClusterRoles = this.clusterRoles.slice((page - 1) * 6, page * 6);
    },
    /* 排序部分 */
    // 时间排序
    timeSort: function(row){
      return row.time;
    },
    // 名称排序
    nameSort: function(row){
      return row.name;
    },
    /* 编辑部分 */
    // 打开 node 编辑框
    showNodeEditDialog(name) {
      this.$store
        .dispatch("nodes/getNodeYamlByName", name)
        .then((res) => {
          console.log(res);
          this.codeYaml = res.data;
          this.editDialogVisible = true; // 打开编辑对话框
        })
        .catch((error) => {
          throw error;
        });
    },
    // 打开 namespace 编辑框
    showNamespaceEditDialog(name) {
      this.$store
        .dispatch("namespaces/getNamespaceYamlByName", name)
        .then((res) => {
          console.log(res);
          this.codeYaml = res.data;
          this.editDialogVisible = true; // 打开编辑对话框
        })
        .catch((error) => {
          throw error;
        });
    },
    // 打开 cluster 编辑框
    showClusterRolesEditDialog(name) {
      this.$store
        .dispatch("clusterRoles/getClusterRoleYamlByName", name)
        .then((res) => {
          console.log(res);
          this.codeYaml = res.data;
          this.editDialogVisible = true; // 打开编辑对话框
        })
        .catch((error) => {
          throw error;
        });
    },
    // 提交修改
    commitYamlChange() {
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
                  this.$message.error("修改失败，请查看 yaml 文件格式");
                  break;
                case 1202:
                  this.$message.error("创建失败，请查看云平台相关错误信息");
                  break;
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
    /* 删除 namespace */
    delNamespace: function (name) {
      this.$confirm("确认删除 namespace", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store
            .dispatch("namespaces/deleteNamespaceByName", name)
            .then((res) => {
              if (res.code == 1200) {
                this.$message.success("删除成功");
                this.getNamespaces();
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
    /* 删除 clusterRole */
    delClusterRole: function (name) {
      this.$confirm("确认删除 clusterRole", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store
            .dispatch("clusterRoles/delClusterRoleByName", name)
            .then((res) => {
              console.log(res);
              if (res.code == 1200) {
                this.$message.success("删除成功");
                this.getClusterRoles();
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
    // 关闭添加或者修改框
    handleClose: function () {
      this.addYaml = "";
      setTimeout(() => {
        this.codemorror.refresh();
      }, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
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
.my-progress {
  color: #000;
  & .el-progress-bar__outer {
    background-color: red !important;
  }
  ::v-deep .el-progress-bar__inner {
    background-color: #e27802 !important;
  }
  ::v-deep .el-progress-bar__innerText {
    color: #1e212d !important;
  }
}
.el-card {
  width: 95%;
}
.el-table {
  margin-bottom: 15px;
  background: #f0f9eb;
}
</style>