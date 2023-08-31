<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span style="font-size: 20px">关于</span>
    </div>
    <div class="content">
      <el-row :gutter="20">
        <el-col :span="6">
          <!-- <img src="../../assets/logo.png" alt > -->
          <!-- <el-image
            :src="require('../../assets/logo.png')"
            fit="scale-down"
          ></el-image> -->
        </el-col>
        <el-col :span="8" style="margin-left: 15px">
          <el-row>
            <el-col>
              <span style="font-size: 30px"> 广联达Java培训班四组 </span>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-col>
              <span style="font-size: 15px">
                
              </span>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <el-row style="margin-top: 20px">
        © Copyright {{ new Date().getFullYear() }} |  |
        广联达Java培训班四组
      </el-row>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      url: "./logo.png",
    };
  },
};
</script>

<style lang="scss" scoped>
.content {
  display: inline;
  align-items: center;
  justify-content: center;
}
</style>