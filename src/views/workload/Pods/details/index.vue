<template>
  <div>
    <el-divider content-position="left"
      ><span style="font-weight: bold; font-size: 20px">{{
        pod.metadata.name
      }}</span></el-divider
    >
    <!-- 利用率信息 -->
    <div v-if="usage.length > 0">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="font-size: 16px">资源利用量</span>
        </div>
        <div>
          <el-row>
            <el-col :span="24">
              <div id="cpu-usage"></div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div id="memory-usage"></div>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <br /><br />
    </div>
    <!-- 分配信息 -->
    <!-- <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 16px">分配信息</span>
      </div>
      <div>
        <el-row>
          cpu 信息
          <el-col :span="8">
            <Card class="my-card">
              <p slot="title">CPU</p>
              <List
                class="my-list"
                item-layout="horizontal"
                :split="false"
                size="large"
              >
                <ListItem class="my-list-item">
                  <i-circle
                    :size="150"
                    :trail-width="trailWidth"
                    :stroke-width="strokeWidth"
                    :percent="6.3"
                    stroke-linecap="square"
                    stroke-color="#ffd880"
                  >
                    <div class="demo-Circle-custom">
                      <h2>6.3%</h2>
                      <span> Requests </span>
                      <p>Cores: {{ pod.status.allocatable.cpu.amount }}</p>
                    </div>
                  </i-circle>
                </ListItem>
                <ListItem class="my-list-item">
                  <i-circle
                    :size="150"
                    :trail-width="trailWidth"
                    :stroke-width="strokeWidth"
                    :percent="12.5"
                    stroke-linecap="square"
                    stroke-color="#ffd880"
                  >
                    <div class="demo-Circle-custom">
                      <h2>12.5%</h2>
                      <span> Limits </span>
                      <p>Cores: {{ pod.status.allocatable.cpu.amount }}</p>
                    </div>
                  </i-circle>
                </ListItem>
              </List>
            </Card>
          </el-col>
          内存信息
          <el-col :span="8" :offset="1">
            <Card class="my-card">
              <p slot="title">内存</p>
              <List class="my-list" item-layout="vertical" :split="false">
                <ListItem class="my-list-item">
                  <i-circle
                    :size="150"
                    :trail-width="trailWidth"
                    :stroke-width="strokeWidth"
                    :percent="0.4"
                    stroke-linecap="square"
                    stroke-color="#95e1d3"
                  >
                    <div class="demo-Circle-custom">
                      <h2>0.4%</h2>
                      <span> Requests </span>
                      <p>
                        GiB:
                        {{
                          (
                            pod.status.allocatable.memory.amount /
                            1024 /
                            1024
                          ).toFixed(2)
                        }}
                      </p>
                    </div>
                  </i-circle>
                </ListItem>
                <ListItem class="my-list-item">
                  <i-circle
                    :size="150"
                    :trail-width="trailWidth"
                    :stroke-width="strokeWidth"
                    :percent="0.8"
                    stroke-linecap="square"
                    stroke-color="#95e1d3"
                  >
                    <div class="demo-Circle-custom">
                      <h2>0.8%</h2>
                      <span> Limits </span>
                      <p>
                        GiB:
                        {{
                          (
                            pod.status.allocatable.memory.amount /
                            1024 /
                            1024
                          ).toFixed(2)
                        }}
                      </p>
                    </div>
                  </i-circle>
                </ListItem>
              </List>
            </Card>
          </el-col>
          pod 信息
          <el-col :span="6" :offset="1">
            <Card class="my-card">
              <p slot="title">Pod</p>
              <List class="my-list" item-layout="vertical" :split="false">
                <ListItem class="my-list-item">
                  <i-circle
                    :size="150"
                    :trail-width="trailWidth"
                    :stroke-width="strokeWidth"
                    :percent="
                      (
                        (podsAmount / pod.status.allocatable.pods.amount) *
                        100
                      ).toFixed(2)
                    "
                    stroke-linecap="square"
                    stroke-color="#b4aee8"
                  >
                    <div class="demo-Circle-custom">
                      <h2>
                        {{
                          (
                            (podsAmount / pod.status.allocatable.pods.amount) *
                            100
                          ).toFixed(2)
                        }}
                        %
                      </h2>
                      <span> Requests </span>
                      <p>Pods: {{ podsAmount }}</p>
                    </div>
                  </i-circle>
                </ListItem>
              </List>
            </Card>
          </el-col>
        </el-row>
      </div>
    </el-card> -->
    <!-- <br /><br /> -->
    <!-- 元数据 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 16px">元数据</span>
      </div>
      <List item-layout="horizontal" :split="false">
        <div class="metadata-item">
          <p>名字</p>
          <span>{{ pod.metadata.name }}</span>
        </div>
        <div class="metadata-item">
          <p>命名空间</p>
          <span>{{ pod.metadata.namespace }}</span>
        </div>
        <div class="metadata-item">
          <p>创建时间</p>
          <span>{{
            pod.metadata.creationTimestamp.replaceAll(/[TZ]/g, " ")
          }}</span>
        </div>
        <div class="metadata-item">
          <p>UID</p>
          <span>{{ pod.metadata.uid }}</span>
        </div>
      </List>
      <!-- 元数据 标签 注释部分 -->
      <List v-if="labels.length > 0" item-layout="horizontal" :split="false">
        <div class="metadata-item">
          <p>标签</p>
          <li v-for="(label, index) in this.labels" :key="index">
            <el-tag
              class="lebel-tag"
              effect="dark"
              size="medium"
              color="#bedcfa"
              >{{ label.key }}: {{ label.value }}</el-tag
            >
          </li>
        </div>
        <div v-if="annotations.length > 0" class="metadata-item">
          <p>注释</p>
          <li v-for="(anno, index) in annotations" :key="index">
            <el-tag
              class="lebel-tag"
              effect="dark"
              size="medium"
              color="#bedcfa"
              >{{ anno.key }}: {{ anno.value }}</el-tag
            >
          </li>
        </div>
      </List>
    </el-card>
    <br /><br />
    <!-- 资源信息 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 16px">资源信息</span>
      </div>
      <List item-layout="horizontal" :split="false">
        <div class="metadata-item">
          <p>节点</p>
          <span>{{ pod.spec.nodeName }}</span>
        </div>
        <div class="metadata-item">
          <p>状态</p>
          <span>{{ pod.status.phase }}</span>
        </div>
        <div class="metadata-item" v-if="pod.status.podIP">
          <p>IP</p>
          <span>{{ pod.status.podIP }}</span>
        </div>
        <div class="metadata-item">
          <p>QoS类</p>
          <span>{{ pod.status.qosClass }}</span>
        </div>
      </List>
    </el-card>
    <br /><br />
    <!-- 状态信息 -->
    <el-card class="box-card" v-if="pod.status.conditions.length > 0">
      <div slot="header" class="clearfix">
        <span style="font-size: 16px">状态</span>
      </div>
      <el-table :data="pod.status.conditions" style="width: 100%" stripe>
        <el-table-column prop="type" label="类别"> </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
        </el-table-column>

        <el-table-column label="最后检测时间">
          <template slot-scope="scope">
            <span>{{
              scope.row.lastTransitionTime.replaceAll(/[TZ]/g, " ")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="原因">
          <template slot-scope="scope">
            <span>{{
              scope.row.reason != undefined ? scope.row.reason : "--"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="信息">
          <template slot-scope="scope">
            <span>{{
              scope.row.message != undefined ? scope.row.message : "--"
            }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <br /><br />
    <!-- 容器信息 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 16px">资源信息</span>
      </div>
      <List item-layout="horizontal" :split="false">
        <div class="metadata-item">
          <p>节点</p>
          <span>{{ pod.spec.nodeName }}</span>
        </div>
        <div class="metadata-item">
          <p>状态</p>
          <span>{{ pod.status.phase }}</span>
        </div>
        <div class="metadata-item" v-if="pod.status.podIP">
          <p>IP</p>
          <span>{{ pod.status.podIP }}</span>
        </div>
        <div class="metadata-item">
          <p>QoS类</p>
          <span>{{ pod.status.qosClass }}</span>
        </div>
        <div class="metadata-item" v-if="pod.status.containerStatuses > 0">
          <p>重启次数</p>
          <span>{{ pod.status.containerStatuses[0].restartCount }}</span>
        </div>
      </List>
    </el-card>
    <br /><br />

    <div v-if="pod.status.containerStatuses.length > 0">
      <el-divider content-position="left"
      ><span style="font-weight: bold; font-size: 18px">容器</span></el-divider
    >
    <div v-for="(container,index) in pod.status.containerStatuses" :key="index">
        <el-card>
            <div slot="header" class="clearfix">
                <span style="font-size: 16px">{{container.name}}</span>
            </div>
            <div class="metadata-item">
            <p>名字</p>
            <span>{{ container.name }}</span>
            </div>
            <div class="metadata-item">
            <p>镜像</p>
            <span>{{ container.image }}</span>
            </div>
          <div class="metadata-item">
            <p>日志</p>
            显示日志&nbsp;&nbsp;<i
            :class="displayLog ? 'el-icon-zoom-out' : 'el-icon-zoom-in'"
            @click="showLog(container.name)"
          ></i>
          </div>
            <!-- <div class="metadata-item">
            <p>容器 id</p>
            <span>{{ container.containerID }}</span>
            </div> -->
        </el-card>
      <br />
    </div>
    </div>


    <!-- 日志框 -->
    <el-dialog
      title="日志"
      :visible.sync="displayLog"
      width="70%"
      @close="displayLog = false"
      :append-to-body="true"
      :lock-scroll="true"
    >
      <el-tabs value="first" type="card">
        <highlightjs
          v-show="displayLog"
          style="width: 100%"
          language="plaintext"
          :code="log"
        />
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="displayLog = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 事件 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 16px">事件</span>
      </div>
      <el-table :data="events" style="width: 100%" stripe>
        <el-table-column label="类型" prop="type" width="100"></el-table-column>
        <el-table-column label="原因" prop="reason" width="170"></el-table-column>
        <el-table-column label="时间" width="150">
          <template slot-scope="scope">
            <span>{{
                scope.row.lastTimestamp ? scope.row.lastTimestamp.replaceAll(/[TZ]/g, " ")
                  : scope.row.eventTime.time ? scope.row.eventTime.time.replaceAll(/[TZ]/g, " ") :
                "无"
              }}</span>
          </template>
        </el-table-column>
        <el-table-column label="来自"  width="170">
          <template slot-scope="scope">
            <span>
              {{scope.row.involvedObject.kind + '/' + scope.row.involvedObject.name}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="信息" prop="message" width=""></el-table-column>
      </el-table>
    </el-card>
    <br /><br />
  </div>
</template>

<script>
export default {
  name: "NodeDetails",
  data() {
    return {
      trailWidth: 5,
      strokeWidth: 5,
      events: [],
      usage: [],
      podName: '',
      pod: {},
      displayLog: false,
      log: '',
    };
  },
  computed: {
    // 元数据下的标签
    labels() {
      let labelArr = [];
      for (let pro in this.pod.metadata.labels) {
        labelArr.push({
          key: pro,
          value: this.pod.metadata.labels[pro],
        });
      }
      return labelArr;
    },
    // 元数据下的注释
    annotations() {
      let annoArr = [];
      for (let anno in this.pod.metadata.annotations) {
        annoArr.push({
          key: anno,
          value: this.pod.metadata.annotations[anno],
        });
      }
      return annoArr;
    },
    // 资源信息下的地址
    addressess() {
      let addrArr = [];
      // console.log(this.pod.status.addresses[0].type);
      for (let addr in this.pod.status.addresses) {
        addrArr.push({
          key: this.pod.status.addresses[addr].type,
          value: this.pod.status.addresses[addr].address,
        });
      }
      return addrArr;
    },
    // 容器名
    containersName() {
      let name = [];
      for(let index in this.pod.spec.containers) {
        name.push(this.pod.spec.containers[index].name);
      }
      return name;
    }
  },
  mounted: function () {
    /* name */
    // 为空，直接存储
    if (sessionStorage.getItem("podName") == null) {
      sessionStorage.setItem("podName", this.$store.state.pods.pod.podName);
      this.podName = this.$store.state.pods.pod.podName;
    }
    // 不为空，且当前 podName 有值，同时和之前的不一样，更新 podName
    else if (
      this.$store.state.pods.pod.podName != "" &&
      sessionStorage.getItem("podName") != this.$store.state.pods.pod.podName
    ) {
      sessionStorage.setItem("podName", this.$store.state.pods.pod.podName);
      this.podName = this.$store.state.pods.pod.podName;
    }
    /* namespace */
    // 为空，直接存储
    if (sessionStorage.getItem("podNamespace") == null) {
      sessionStorage.setItem(
        "podNamespace",
        this.$store.state.pods.pod.podNamespace
      );
      this.podNamespace = this.$store.state.pods.pod.podNamespace;
    }
    // 不为空，且当前 podNamespace 有值，同时和之前的不一样，更新 podNamespace
    else if (
      this.$store.state.pods.pod.podNamespace != "" &&
      sessionStorage.getItem("podNamespace") !=
        this.$store.state.pods.pod.podNamespace
    ) {
      sessionStorage.setItem(
        "podNamespace",
        this.$store.state.pods.pod.podNamespace
      );
      this.podNamespace = this.$store.state.pods.pod.podNamespace;
    }
    let podDetails = {
      podName: sessionStorage.getItem("podName"),
      podNamespace: sessionStorage.getItem("podNamespace"),
    };
    this.$store
      .dispatch("pods/getPodResources", podDetails)
      .then((res) => {
        console.log(res);
        this.pod = res.data.podDetails.pod;
        this.usage = res.data.podDetails.podUsagesList;
        this.events = res.data.events;
      })
      .catch((error) => {
        throw error;
      });
  },
  updated: function () {
    // 获取近20分钟的 cpu 和内存使用率进行画图
    if (this.usage.length > 0) {
      //   let cpu = this.usage.status.allocatable.cpu.amount;
      //   let memory = this.pod.status.allocatable.memory.amount;
      let cpuArr = [];
      let memoryArr = [];
      let timeArr = [];
      for (let i = 0; i < this.usage.length; i++) {
        // 格式化 cpu 数据
        cpuArr.push((this.usage[i].cpu / 1000 / 1000).toFixed(4));
        // 格式化 内存数据
        memoryArr.push((this.usage[i].memory / 1024).toFixed(4));
        // 格式化时间数据
        timeArr.push(this.usage[i].time.substring(11, 16));
      }
      // 配置 cpu 图表项
      let optionCpu = {
        title: {
          show: true,
          text: "CPU",
          textAlign: "auto",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: timeArr,
          name: "时间",
        },
        yAxis: {
          type: "value",
          name: "使用量",
        },
        series: [
          {
            data: cpuArr,
            type: "line",
            areaStyle: {},
          },
        ],
      };
      // 配置内存图表项
      let optionMemory = {
        title: {
          show: true,
          text: "内存",
          textAlign: "auto",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: timeArr,
          name: "时间",
        },
        yAxis: {
          type: "value",
          name: "使用量",
        },
        series: [
          {
            data: memoryArr,
            type: "line",
            areaStyle: {},
          },
        ],
      };
      let cpuDom = document.getElementById("cpu-usage");
      // console.log(cpuDom);
      let memoryDom = document.getElementById("memory-usage");
      let cpuChart = this.$echarts.init(cpuDom, null, { renderer: "svg" });
      let memoryChart = this.$echarts.init(memoryDom, null, {
        renderer: "svg",
      });
      optionCpu && cpuChart.setOption(optionCpu);
      optionMemory && memoryChart.setOption(optionMemory);
    }
  },
  created: function () {
    window.addEventListener("unload", this.savepodInfo);
  },
  methods: {
    savepodInfo() {
      sessionStorage.setItem("podName");
    },

    showLog(name) {
      this.getPodLogFromContainer(name);
      this.displayLog = true;
    },

    getPodLogFromContainer(name) {
      let data = {
        name: sessionStorage.getItem("podName"),
        namespace: sessionStorage.getItem("podNamespace"),
        containerName: name
      };
      console.log(data);
      this.$store
        .dispatch("pods/getPodLogFromContainer", data)
        .then((res) => {
          console.log(res.data);
          this.log = res.data;
        })
        .catch((error) => {
          throw error;
        });
    },

  },
};
</script>

<style lang="scss" scoped>
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
</style>
