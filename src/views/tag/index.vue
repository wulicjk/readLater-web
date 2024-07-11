<template>
  <div class="dashboard-container">
    <!--    <div class="dashboard-text">name: {{ name }}</div>-->
    <div ref="containerDiv">
      <el-row :gutter="20">
        <!--        一行是分成24份-->
        <!--        <el-col :span="4" v-for="(o, index) in 12" :key="o" :offset="index > 0 ? 0 : 0">-->
        <!--        <el-col :span="4" v-for="(o, index) in 12" :key="o" :offset="1">-->
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :order="1" v-for="(o, index) in 20" :key="o" :offset="0"
                class="custom-col">
          <el-card :body-style="{ padding: '4px' }">
            <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                 class="image" height="150px">
            <div style="padding: 14px;">
              <span>好吃的汉堡</span>
              <div class="bottom clearfix">
                <time class="time">{{ currentDate }}</time>
                <el-button type="text" class="button">操作按钮</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      tags: [],
      currentDate: new Date(),
    }
  },
  created() {
    // this.getTags()
  },
  methods: {
    getTags() {
      getTagList().then(res => {
        console.log(res)
      })
    },
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

//卡片
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.custom-col {
  max-width: 300px;
}
</style>
