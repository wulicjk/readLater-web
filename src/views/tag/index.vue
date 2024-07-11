<template>
  <div class="dashboard-container">
    <!--    <div class="dashboard-text">name: {{ name }}</div>-->
    <div ref="containerDiv">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :order="1" v-for="(o, index) in 20" :key="o" :offset="0"
                class="custom-col">
          <el-card :body-style="{ padding: '4px' }">
            <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image" height="150px">
            <div style="padding: 14px;height: 185px">
              <h2 class="title" style="margin-top: 0;">好吃的汉吃的好吃的汉吃的好吃的汉吃的好吃的汉吃的</h2>
              <div class="description">这是一个简介这是一个简介这是一个简介这是一个简介这是一个简介这是一个简介这是一个简介这是一个简介这是一个简介</div>
              <div class="option" style="margin-top: 4px;">
                <time class="time">2024/7/11 11:43</time>

                <el-dropdown>
                  <el-button type="mini" class="no-border no-hover">
                    <img class="option-icon" src="@/assets/icon/options-horizontal.svg" alt="选择" width="24" height="24">
                  </el-button>
                  <el-dropdown-menu slot="dropdown"  class="custom-dropdown">
                    <el-dropdown-item>
                      <img class="option-icon" src="@/assets/icon/edit.svg" alt="编辑" width="24" height="24">
                      编辑
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <img class="option-icon" src="@/assets/icon/moveTo.svg" alt="移动到" width="24" height="24">
                      移动到
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <img class="option-icon" src="@/assets/icon/delete.svg" alt="删除" width="24" height="24">
                      删除
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <img class="option-icon" src="@/assets/icon/copy.svg" alt="复制链接" width="24" height="24">
                      复制链接
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
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

.title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.option-icon {
  cursor: pointer;
}
.time {
  font-size: 13px;
  color: #999;
}

.no-border {
  border: none !important;
}
.no-hover:hover,
.no-hover:focus{
  background-color: transparent !important;
}
.el-dropdown:hover .el-button {
  background-color: transparent !important;
}

.custom-dropdown {
  border-radius: 10px;
  padding: 10px 0;
  font-size: 16px;
}
.custom-dropdown .el-dropdown-menu__item {
  padding: 5px 20px;
  color: #666;
  font-size: 14px;
}

.option-icon {
  margin-right: 4px;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}
</style>
