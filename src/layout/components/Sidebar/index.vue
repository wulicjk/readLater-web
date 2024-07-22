<template>
  <div :class="{'has-logo':showLogo}">
<!--    logo页面-->
    <logo v-if="showLogo" :collapse="isCollapse" />
<!--    这是一个由 Element UI 提供的可滚动容器组件,用于在侧边栏导航内容超出屏幕时提供滚动功能。-->
    <el-scrollbar wrap-class="scrollbar-wrapper">
<!--      这是 Element UI 提供的菜单组件,用于渲染侧边栏导航菜单。-->
<!--      mode="vertical" 这个属性用于设置菜单的展示模式,在这里设置为垂直模式。-->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
<!--         用来渲染所有的侧边栏项-->
<!--        遍历一级菜单-->
        <sidebar-item v-for="route in routeArr" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  data(){
    return{
      routeArr:[]
    }
  },
  mounted() {
      this.$nextTick(() => {
        this.routeArr = this.$router.options.routes
      })
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
}
</script>
