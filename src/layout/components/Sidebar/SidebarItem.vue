<template>
  <div v-if="!item.hidden">
    <template
      v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <div class="menu-item-content">
            <div class="item-container">
              <item v-if="!isTagEditMode" :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title"/>
              <input v-if="isTagEditMode" v-model="editTitle" type="text" class="edit-input">
            </div>
            <div v-if="showActionButtons &&!isTagEditMode" class="action-buttons">
              <img src="@/assets/icon/edit.svg" alt="Edit Icon" width="14" height="14" class="icon-img"
                   @click="changeTagEditMode">
              <img src="@/assets/icon/delete.svg" alt="Delete Icon" width="14" height="14" class="icon-img"
                   @click="changeTagDangerMode" v-if="!isTagDangerMode">
              <img src="@/assets/icon/danger.svg" alt="Delete Icon" width="14" height="14" class="icon-img"
                   v-if="isTagDangerMode" @click="deleteTag">
            </div>
            <div v-if="isTagEditMode" class="action-buttons">
              <img src="@/assets/icon/true.svg" alt="Edit Icon" width="14" height="14" class="icon-img">
              <img src="@/assets/icon/false.svg" alt="Delete Icon" width="14" height="14" class="icon-img"
                   @click="cancleTagEditMode">
            </div>
          </div>
        </el-menu-item>
      </app-link>
    </template>
    <!--    有子菜单时用这个渲染-->
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title"/>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
      <!-- 如果当前菜单项的 name 属性为 "dashboard"，则添加一个"添加子菜单"的按钮 -->
      <div v-if="item.name === 'dashboard'">
        <div class="operateButton" v-if="!showButtons">
          <div class="left-side">
            <el-menu-item index="add-submenu">
              <img src="@/assets/icon/add.svg" alt="Add Icon" width="14" height="14" class="icon-img">
              <span>Add</span>
            </el-menu-item>
          </div>
          <div class="right-side">
            <el-menu-item index="add-submenu" @click="changeEditMode">
              <img src="@/assets/icon/edit.svg" alt="Add Icon" width="14" height="14" class="icon-img">
              <span>Edit</span>
            </el-menu-item>
          </div>
        </div>
        <div class="finishButton" v-if="showButtons">
          <div>
            <el-menu-item index="add-submenu" @click="changeFinishMode">
              <img src="@/assets/icon/success.svg" alt="Add Icon" width="14" height="14" class="icon-img">
              <span>Finish</span>
            </el-menu-item>
          </div>
        </div>
      </div>
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import {isExternal} from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'
import {mapActions} from "vuex";
import store from "@/store";

export default {
  name: 'SidebarItem',
  components: {Item, AppLink},
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  created() {

  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {
      isTagEditMode: false,
      isTagDeleteMode: false,
      isTagDangerMode: false,
      editTitle: "",
    }
  },
  mounted() {
    if (!this.item.hidden){
      if (this.onlyOneChild.name.includes('tag')){
        this.editTitle = this.onlyOneChild.meta.title
      }
    }
  },
  computed: {
    showActionButtons() {
      return this.$store.state.sidebar.isEditMode && this.item.name.includes('tag')&&this.item.path!=='tag';
    },
    showButtons() {
      return this.$store.state.sidebar.isEditMode;
    },
    sidebarInitStatus() {
      return this.$store.state.sidebar.initStatus
    }
  },
  watch: {
    sidebarInitStatus(oldStatus, newStatus) {
      this.initAllStatus()
    }
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // 当只有一个子路由器时，默认情况下会显示子路由器
      if (showingChildren.length === 1) {
        return true
      }

      // 如果没有要显示的子路由器，则显示父路由器
      if (showingChildren.length === 0) {
        this.onlyOneChild = {...parent, path: '', noShowingChildren: true}
        return true
      }
      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    },
    async changeEditMode() {
      await store.dispatch('sidebar/toggleEditMode')
    },
    //一个路由页面内的修改
    changeTagEditMode() {
      this.isTagEditMode = !this.isTagEditMode
    },
    cancleTagEditMode() {
      this.isTagEditMode = !this.isTagEditMode
    },
    changeTagDangerMode() {
      this.isTagDangerMode = !this.isTagDangerMode
      setTimeout(() => {
        this.isTagDangerMode = !this.isTagDangerMode;
      }, 3000);
    },
    deleteTag() {

    },
    async changeFinishMode() {
      await store.dispatch('sidebar/initAllTagStatus')
    },
    async initAllStatus() {
      this.isTagEditMode = false
      this.isTagDeleteMode = false
      this.isTagDangerMode = false
      await store.dispatch('sidebar/toggleEditMode')
    },
    editMenuItem() {
      // 添加编辑菜单项的逻辑
      console.log('Editing menu item:', this.item);
    },
    deleteMenuItem() {
      // 添加删除菜单项的逻辑
      console.log('Deleting menu item:', this.item);
    },
    addSubmenu() {
      // 添加添加子菜单的逻辑
      console.log('Adding submenu to:', this.item);
    },
  }
}
</script>

<style>
.menu-item-content {
  display: flex;
  justify-content: space-between;
}

.action-buttons {
  display: flex;
  align-items: center;
  padding-right: 10px;
}

.item-container {
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

}

.edit-input{
  max-width: 120px;
}

</style>
