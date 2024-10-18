<template>
  <div class="dashboard-container">
    <div>
      <el-row :gutter="20" style="max-width: 1500px;">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="(item,index) in readList" :key="item.id" :offset="0"
                :ref="index === readList.length - 1 ? 'lastItem' : ''"
                class="custom-col">
          <el-card :body-style="{ padding: '4px' }">
            <img :src="item.imageUrl" class="image" height="150px" @click="goToLink(item.link)" style="cursor: pointer;">
            <div style="padding: 14px 14px 4px 14px;height: 185px">
              <h2 class="title" style="margin-top: 0; cursor: pointer;" @click="goToLink(item.link)">{{ item.title }}</h2>
              <div class="description" @click="goToLink(item.link)" style="cursor: pointer;">
                {{ item.brief }}
              </div>
              <div class="option" style="margin-top: 4px;">
                <time class="time">{{ formatDateTime(item.CreatedAt) }}</time>

                <el-dropdown placement="top-end">
                  <el-button type="mini" class="no-border no-hover">
                    <img class="option-icon" src="@/assets/icon/options-horizontal.svg" alt="选择" width="24"
                         height="24">
                  </el-button>
                  <el-dropdown-menu slot="dropdown" class="custom-dropdown">
                    <el-dropdown-item>
                      <div @click="editCardDiag(item)">
                        <img class="option-icon" src="@/assets/icon/edit.svg" alt="编辑" width="24" height="24">
                        编辑
                      </div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div @click="moveToDiag(item.ID)">
                        <img class="option-icon" src="@/assets/icon/moveTo.svg" alt="移动到" width="24" height="24">
                        移动到
                      </div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div @click="deleteCard(item.ID)">
                        <img class="option-icon" src="@/assets/icon/delete.svg" alt="删除" width="24" height="24">
                        删除
                      </div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div @click="copyToClipboard(item.link)">
                        <img class="option-icon" src="@/assets/icon/copy.svg" alt="复制链接" width="24" height="24">
                        复制链接
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div ref="loadMore" class="load-more"></div>
    </div>
    <div class="el-dialog-no-top-padding">
      <el-dialog
        title="Add a Link"
        :visible.sync="modalAddLinkStatus"
        width="50%" class="centered-dialog">
        <el-divider class="divider"></el-divider>
        <div class="add-link-bottom-side">
          <el-input v-model="url" placeholder="www.example.com/article.html" style="width: 80%"></el-input>
          <el-button @click="addLink" style="background-color: #222; color: white;">添加</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="el-dialog-no-top-padding">
      <el-dialog
        title="编辑卡片"
        :visible.sync="modalEditCardStatus"
        width="80%" class="centered-dialog">
        <el-divider class="divider"></el-divider>
        <el-form ref="form" :model="card" label-width="80px">
          <el-form-item label="ImageUrl">
            <el-input v-model="card.imageUrl"></el-input>
          </el-form-item>
          <el-form-item label="Title">
            <el-input v-model="card.title"></el-input>
          </el-form-item>
          <el-form-item label="Brief">
            <el-input v-model="card.brief"></el-input>
          </el-form-item>
          <el-form-item label="Link">
            <el-input v-model="card.link"></el-input>
          </el-form-item>
          <el-form-item class="text-right">
            <el-button @click="editCard" style="background-color: #222; color: white;">确定</el-button>
            <el-button @click="cancleEdit">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div class="el-dialog-no-top-padding">
      <el-dialog
        title="移动到Tag"
        :visible.sync="movetoDiagStatus"
        width="40%" class="centered-dialog">
        <el-divider class="divider"></el-divider>
        <el-form ref="form" :model="card" label-width="80px">
          <el-form-item>
            <el-select v-model="tagOptionsValue" placeholder="请选择标签">
              <el-option
                v-for="item in tagOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="text-right">
            <el-button @click="moveToTags" style="background-color: #222; color: white;">确定</el-button>
            <el-button @click="cancleMove">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {addLinkToCard, deleteCard, editCard, formatDateTime, getReadList} from "@/api";
import {resMessage} from "@/api/common";

export default {
  name: 'Dashboard',
  data() {
    return {
      readList: [],
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      },
      url: "",
      modalEditCardStatus: false,
      card: {
        imageUrl: "",
        title: "",
        brief: "",
        link: "",
      },
      movetoDiagStatus: false,
      currentId: "",
      tagOptions: [],
      tagOptionsValue: '',
      // 是否正在加载
      loading: false,
      // 是否还有更多数据
      hasMore: true,
      // 当前页码
      page: 1,
      // 每页数量
      pageSize: 12
    }
  },
  created() {
  },
  methods: {
    goToLink(link) {
      console.log(link);
      window.open(link, '_blank');
    },
    formatDateTime,
    getTagId() {
      let routeName = this.$route.name;
      if (routeName === 'tag') {
        return "0"
      }
      return routeName.slice(3)
    },
    getTagReadList() {
      //初始化
      this.readList = []
      this.loading = false
      // 是否还有更多数据
      this.hasMore = true
      // 当前页码
      this.page = 1
      return this.loadMore()
    },
    addLink() {
      addLinkToCard({url: this.url}).then(res => {
        resMessage(res, this)
        this.$store.dispatch('app/modalAddLink')
        this.easyLoadList()
        this.url = ""
      })
    },
    deleteCard(id) {
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteCard(id).then(res => {
          resMessage(res, this)
          this.easyLoadList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    editCardDiag(item) {
      this.card = item
      this.modalEditCardStatus = true
    },
    cancleEdit() {
      this.modalEditCardStatus = false
    },
    editCard() {
      editCard(this.card).then(res => {
        resMessage(res, this)
        this.modalEditCardStatus = false
        this.easyLoadList()
      })
    },
    copyToClipboard(link) {
      if (navigator.clipboard && window.isSecureContext) {
        // 使用 navigator.clipboard.writeText() 将链接复制到剪贴板
        navigator.clipboard.writeText(link)
          .then(() => {
            // 复制成功后的提示
            this.$message({
              message: '链接已复制到剪贴板',
              type: 'success'
            });
          })
          .catch(err => {
            // 复制失败的错误处理
            console.error('复制链接失败:', err);
            this.$message({
              message: '复制链接失败',
              type: 'error'
            });
          });
      } else {
        // 创建text area
        let textArea = document.createElement("textarea");
        textArea.value = link;
        // 使text area不在viewport，同时设置不可见
        textArea.style.position = "absolute";
        textArea.style.opacity = 0;
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
          // 执行复制命令并移除文本框
          document.execCommand('copy') ? res() : rej();
          textArea.remove();
          this.$message({
            message: '链接已复制到剪贴板',
            type: 'success'
          });
        });
      }
    },
    moveToDiag(id) {
      this.tagOptions = []
      this.currentId = id
      let tags = this.$store.state.user.tagCategories
      tags.forEach(tag => {
        if (typeof tag.name != "undefined" && tag.name.includes('tag')) {
          this.tagOptions.push({value: tag.id, label: tag.tagName})
        }
      });
      this.movetoDiagStatus = true
    },
    cancleMove() {
      this.movetoDiagStatus = false
    },
    moveToTags() {
      let data = {'ID': this.currentId, 'tagId': this.tagOptionsValue}
      editCard(data).then(res => {
        resMessage(res, this)
        this.movetoDiagStatus = false
        this.easyLoadList()
        this.tagOptionsValue = ""
      })
    },
    loadMore() {
      if (this.loading || !this.hasMore) return
      this.loading = true
      let tagId = this.getTagId()
      return getReadList({
        tagId: tagId,
        page: this.page,
        pageSize: this.pageSize
      }).then(res => {
        this.readList.push(...res.data.list)
        this.page++
        this.hasMore = res.data.pageSize * res.data.page < res.data.total
        this.loading = false
      })
    },
    easyLoadList(){
      this.getTagReadList().then(res => {
        this.setupIntersectionObserver();
      })
    },
    setupIntersectionObserver() {
      const options = {
        root: null,
        rootMargin: '100px',
        threshold: 0.75,
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadMore();
          }
        });
      }, options);
      this.observer.observe(this.$refs.loadMore)
    },
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
    modalAddLinkStatus: {
      get() {
        return this.$store.state.app.modalAddLink
      },
      set(value) {
        this.$store.state.app.modalAddLink = value;
      }
    }
  },
  mounted() {
    this.easyLoadList()
  },
  beforeDestroy() {
    this.observer.disconnect()
  }
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
  margin-top: 8px;
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
.no-hover:focus {
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

.el-dialog-no-top-padding {
  ::v-deep {
    .el-dialog__body {
      padding-top: 0;
    }
  }
}

.divider {
  margin-top: 0;
}

.add-link-bottom-side {
  display: flex;
  justify-content: space-between;
}


::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}

::v-deep .el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}

</style>
