<template>
  <div>
    <!-- CronJobs 主体部分 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>图片列表</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="searchInput" placeholder="请输入内容"></el-input>
        </el-col>
        <!-- 搜索按钮 --> 
        <el-col :span="4">
          <el-button
            type="primary"
            size="large"
            @click="searchByFileName()"
          >
            搜索
          </el-button>
        </el-col>
        <!-- 添加按钮 -->
        <el-col :span="4">
          <el-upload
             v-if="show"
            :show-file-list="false"
            class="upload-demo"
            action="a"
            :limit="1"
            ref="upload"
            accept=".png"
            :on-success="handleAvatarSuccess"
            :http-request="uploadFile">
            <el-button size="small" type="primary">上传文件</el-button>
          </el-upload>
        </el-col>
      </el-row>
      <!-- 展示查询table -->
      <el-table
        v-loading="loading"
        :data="cronJobsInCurrentPage"
        style="width: 100%"
        stripe
        element-loading-text="获取数据中..."
      >
        <el-table-column width="40">
          <template>
            <svg-icon :icon-class="'load-success'" />
          </template>
        </el-table-column>
        <el-table-column prop="fileName" label="文件名称">
        
        </el-table-column>
        <!-- <el-table-column prop="apiVersion" label="版本"> </el-table-column> -->
        <el-table-column prop="fileType" label="文件类型" />
        <el-table-column prop="fileSize" label="文件大小" />

        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              style="margin-bottom: 5px"
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="
                loadfile(scope.row.fileId,scope.row.fileName)
              "
            >下载</el-button>
     
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="delCronJob(scope.row.fileId)"
            >删除</el-button>

                  <!-- 删除 -->
            <el-button
              type="warning"
              icon="el-icon-delete"
              size="small"
              @click=""
            >预览</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        layout=" prev, pager, next, jumper, ->, total, slot"
        :total="cronJobsAmount"
        @current-change="handleCurrentChange"
      />
    </el-card>
    
  </div>
</template>

<script>
// import language js
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/yaml/yaml.js'
// import theme style
import 'codemirror/theme/panda-syntax.css'
import axios from 'axios';
import { Upload } from 'view-design';
export default {
  name: 'CronJobs',

  data() {
    return {
      /** 基础信息 */
      searchInput:'',
      show:true,
      loading: true, // 获取数据中
      /** 命名空间*/
      value: '',
      /** 分页 */
      cronJobsAmount: 0, // CronJob 总数
      currentPage: 1, // 分页绑定当前页
      cronJobsInCurrentPage: [], // 页面中的 CronJobs
      pageSize: 6, // 一页显示数量
      /** 编辑 */
    }
  },

  created() {
    const data = {
        current: "1",
        size: "5",
        fileName:""
      }
    this.getCronJobs(data)
  },

  methods: {
    /** 基础 */
    //搜索通过文件名
    searchByFileName() {
      const data = {
        current: "1",
        size: "2",
        fileName:  this.searchInput
      }
      this.$store
        .dispatch('cronJobs/getAllCronJobs', data)
        .then((res) => {
          console.log(res.data)
          
          this.pageSize = parseInt(data.size)
          // this.cronJobs =res.data
          this.cronJobsAmount = res.data.total
          // this.cronJobsInCurrentPage = this.cronJobs.slice(0, this.pageSize)
          this.cronJobsInCurrentPage =res.data.records
        })
        .catch((error) => {
          console.log(error)
          this.cronJobs = []
          this.cronJobsAmount = 0
          this.cronJobsInCurrentPage = []
        })
      this.loading = false
    },

    handleAvatarSuccess(){
      console.log("handleAvatarSuccess");
      this.$refs.upload.clearFiles();
    },

    // 获取所有 CronJobs
    getCronJobs(data) {
      this.$store
        .dispatch('cronJobs/getAllCronJobs', data)
        .then((res) => {
          console.log(res.data)
          this.pageSize = data.size
          // this.cronJobs =res.data
          this.cronJobsAmount = res.data.total
          // this.cronJobsInCurrentPage = this.cronJobs.slice(0, this.pageSize)
          this.cronJobsInCurrentPage =res.data.records
        })
        .catch((error) => {
          console.log(error)
          this.cronJobs = []
          this.cronJobsAmount = 0
          this.cronJobsInCurrentPage = []
        })
      this.loading = false
    },

    // 获取所有 CronJobs
    loadfile(fileId,fileName) {
      this.$axios({
        url: "http://localhost:8060/files/download?fileId="+ fileId,
        method: 'get',
        headers: {
          'token': window.sessionStorage.getItem('Token')
        },
        data: {

        },
        responseType: 'blob'
      }).then((res) => {
        console.log('下载模板', res)
        console.log(window.sessionStorage.getItem('Token'))
        const blob = new Blob([res.data]);
        const objectUrl = URL.createObjectURL(blob)
        console.log(objectUrl)
        //window.location.href = objectUrl
        const a = document.createElement('a')
        a.style.display = 'none'
        a.download = fileName // 自定义下载的文件名 【这个地方必须加,不然会跳转到页面，页面上是乱码】
        a.href = objectUrl
        a.click()

        this.$message({
          type: 'success',
          message: '正在下载模板'
        })
      })
    },

    uploadFile(params) {
     // debugger;
      console.log(params)
      const file = params.file;
     // 使用FormData传参数和文件
     var form = new FormData();
     var self = this;
     // 添加键值对
     form.append("file", file);
     form.append("fileType","images")
     // 传给后台FormData， 此时form = {date: xx, file: xxx(FormData)}
       this.$store
        .dispatch('establish/createPodFromYamlFile', form)
        .then((res) => {
          console.log(res)
          self.$refs.upload.clearFiles();
          this.$message("添加成功")
        })
        .catch(() => {})
    },

    /** 删除*/
    // 删除 CronJob
    delCronJob(fileId) {
      console.log("dele")
      this.$confirm('确认删除 CronJob？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store
            .dispatch(
              'cronJobs/deleteCronJobById',
              fileId
            )
            .then((res) => {
              console.log(res)
              if (res.success) {
                this.$message.success('删除成功')
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
    },

    /** 分页*/
    // 分页事件
    handleCurrentChange(currentPage) {
      const data = {
        current: currentPage,
        size: "5",
        fileName: this.searchInput
      }
      this.getCronJobs(data)
      // this.currentPage = currentPage
      // this.cronJobsInCurrentPage = this.cronJobs.slice(
      //   (this.currentPage - 1) * this.pageSize,
      //   this.currentPage * this.pageSize
      // )
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
