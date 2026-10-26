<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 当前登录用户姓名（登录成功时存进 localStorage 的 loginUser 里）
const loginUser = JSON.parse(localStorage.getItem('loginUser') || '{}')
const currentName = loginUser.name || '用户'

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确认退出登录吗？', '提示', { type: 'warning' })
    .then(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('loginUser')
      router.push('/login')
    })
    .catch(() => {})
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- Header 区域 -->
      <el-header class="header">
        <span class="title">Tlias智能学习辅助系统</span>
        <span class="right_tool">
          <span class="welcome">欢迎{{ currentName }}&nbsp;&nbsp;</span>
          <a href="">
            <el-icon><EditPen /></el-icon> 修改密码 &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp;
          </a>
          <a href="javascript:;" @click="handleLogout">
            <el-icon><SwitchButton /></el-icon> 退出登录
          </a>
        </span>
      </el-header>
      
      <el-container>
        <!-- 左侧菜单 -->
        <el-aside width="200px" class="aside">
          <el-menu router :default-active="route.path" class="el-menu-vertical-demo">
            <el-menu-item index="/">
              <el-icon><Location /></el-icon>
              <span>首页</span>
            </el-menu-item>
            <el-sub-menu index="user">
              <template #title>
                <el-icon><Menu /></el-icon>
                <span>用户管理</span>
              </template>
              <el-menu-item index="/user/list">用户列表</el-menu-item>
              <el-menu-item index="/user/role">角色管理</el-menu-item>
              <el-menu-item index="/user/perm">权限管理</el-menu-item>
            </el-sub-menu>
            
            <el-sub-menu index="system">
              <template #title>
                <el-icon><OfficeBuilding /></el-icon>
                <span>系统信息管理</span>
              </template>
              <el-menu-item index="/dept">部门管理</el-menu-item>
              <el-menu-item index="/emp">员工管理</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="data">
              <template #title>
                <el-icon><Document /></el-icon>
                <span>数据统计管理</span>
              </template>
              <el-menu-item index="/data/emp">员工信息统计</el-menu-item>
              <el-menu-item index="/data/students">学员信息统计</el-menu-item>
            </el-sub-menu>
            
          </el-menu>
        </el-aside>
        
        <el-main>
          <router-view />
        </el-main>
      </el-container>
      
    </el-container>
  </div>
</template>

<style scoped>
.header {
  background-image: linear-gradient(to right, #00547d, #007fa4, #00aaa0, #00d072, #a8eb12);
}

.title {
  color: white;
  font-size: 40px;
  font-family: 楷体;
  line-height: 60px;
  font-weight: bolder;
}

.right_tool{
  float: right;
  line-height: 60px;
}

a {
  color: white;
  text-decoration: none;
}

.welcome {
  color: white;
  font-size: 15px;
}

.aside {
  width: 220px;
  border-right: 1px solid #ccc;
  height: 730px;
}
</style>
