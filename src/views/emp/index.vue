<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { pageApi, addApi, getByIdApi, updateApi, deleteBatchApi } from '@/api/emp.js'
import { queryAllApi } from '@/api/dept.js'

// ============ 查询条件 ============
const queryParams = reactive({
  name: '',
  gender: '',
  begin: '',
  end: '',
  page: 1,
  pageSize: 10
})

// 日期范围绑定
const dateRange = ref([])

// ============ 表格数据 ============
const tableData = ref([])
const total = ref(0)
const selectedIds = ref([]) // 复选框选中的员工id

// 查询
const loadData = async () => {
  // 把日期范围拆成 begin / end
  if (dateRange.value && dateRange.value.length === 2) {
    queryParams.begin = dateRange.value[0]
    queryParams.end = dateRange.value[1]
  } else {
    queryParams.begin = ''
    queryParams.end = ''
  }
  const result = await pageApi(queryParams)
  if (result.code === 1) {
    tableData.value = result.data.rows
    total.value = result.data.total
  }
}

// 查询按钮
const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

// 清空查询
const handleReset = () => {
  queryParams.name = ''
  queryParams.gender = ''
  dateRange.value = []
  queryParams.page = 1
  loadData()
}

// 分页
const handlePageChange = (page) => {
  queryParams.page = page
  loadData()
}
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  queryParams.page = 1
  loadData()
}

// 复选框选中
const handleSelectionChange = (rows) => {
  selectedIds.value = rows.map(r => r.id)
}

// ============ 部门下拉 ============
const deptList = ref([])
const loadDeptList = async () => {
  const res = await queryAllApi()
  if (res.code === 1) deptList.value = res.data
}

// ============ 职位 / 性别 字典 ============
const jobMap = { 1: '班主任', 2: '讲师', 3: '学工主管', 4: '教研主管', 5: '咨询师' }
const genderMap = { 1: '男', 2: '女' }

// ============ 新增 / 编辑弹窗 ============
const dialogVisible = ref(false)
const formTitle = ref('')
const empFormRef = ref()
const emp = reactive({
  id: null,
  username: '',
  name: '',
  gender: 1,
  phone: '',
  job: '',
  salary: '',
  image: '',
  entryDate: '',
  deptId: ''
})

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  job: [{ required: true, message: '请选择职位', trigger: 'change' }],
  deptId: [{ required: true, message: '请选择部门', trigger: 'change' }],
  entryDate: [{ required: true, message: '请选择入职日期', trigger: 'change' }]
}

// 打开新增
const handleAdd = () => {
  formTitle.value = '新增员工'
  Object.assign(emp, {
    id: null, username: '', name: '', gender: 1, phone: '',
    job: '', salary: '', image: '', entryDate: '', deptId: ''
  })
  dialogVisible.value = true
}

// 打开编辑
const handleEdit = async (row) => {
  formTitle.value = '编辑员工'
  const res = await getByIdApi(row.id)
  if (res.code === 1) {
    Object.assign(emp, res.data)
    dialogVisible.value = true
  }
}

// 保存（新增/编辑）
const handleSave = async () => {
  await empFormRef.value.validate()
  let res
  if (emp.id) {
    res = await updateApi(emp)
  } else {
    res = await addApi(emp)
  }
  if (res.code === 1) {
    ElMessage.success(emp.id ? '修改成功' : '新增成功')
    dialogVisible.value = false
    loadData()
  } else {
    ElMessage.error(res.msg)
  }
}

// 单条删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除员工 ${row.name} 吗？`, '提示', { type: 'warning' })
    .then(async () => {
      const res = await deleteBatchApi([row.id])
      if (res.code === 1) {
        ElMessage.success('删除成功')
        loadData()
      } else {
        ElMessage.error(res.msg)
      }
    })
    .catch(() => {})
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请先勾选要删除的员工')
    return
  }
  ElMessageBox.confirm(`确认删除选中的 ${selectedIds.value.length} 个员工吗？`, '提示', { type: 'warning' })
    .then(async () => {
      const res = await deleteBatchApi(selectedIds.value)
      if (res.code === 1) {
        ElMessage.success('批量删除成功')
        loadData()
      } else {
        ElMessage.error(res.msg)
      }
    })
    .catch(() => {})
}

// 头像上传成功后赋值
const handleAvatarSuccess = (res) => {
  if (res.code === 1) {
    emp.image = res.data
  }
}

onMounted(() => {
  loadData()
  loadDeptList()
  getToken()
})
const token = ref('')
// 获取token：el-upload 上传走的是原生请求，不经过 axios 拦截器，必须手动带上 token
const getToken = () => {
  token.value = localStorage.getItem('token') || ''
}
</script>

<template>
  <div class="emp-page">
    <!-- 查询区 -->
    <div class="search-bar">
      <span>姓名：</span>
      <el-input v-model="queryParams.name" placeholder="请输入员工姓名" clearable style="width: 180px" />
      <span style="margin-left: 20px">性别：</span>
      <el-select v-model="queryParams.gender" placeholder="请选择" clearable style="width: 120px">
        <el-option label="男" :value="1" />
        <el-option label="女" :value="2" />
      </el-select>
      <span style="margin-left: 20px">入职时间：</span>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="到"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD"
      />
      <el-button type="primary" style="margin-left: 20px" @click="handleSearch">查询</el-button>
      <el-button @click="handleReset">清空</el-button>
    </div>

    <!-- 操作按钮区 -->
    <div class="btn-bar">
      <el-button type="primary" @click="handleAdd">+ 新增员工</el-button>
      <el-button type="danger" @click="handleBatchDelete">- 批量删除</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" border stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column label="性别" width="70">
        <template #default="{ row }">{{ genderMap[row.gender] }}</template>
      </el-table-column>
      <el-table-column label="头像" width="90">
        <template #default="{ row }">
          <el-image :src="row.image" style="width: 50px; height: 50px" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column prop="deptName" label="所属部门" />
      <el-table-column label="职位">
        <template #default="{ row }">{{ jobMap[row.job] }}</template>
      </el-table-column>
      <el-table-column prop="entryDate" label="入职日期" />
      <el-table-column prop="updateTime" label="最后操作时间" />
      <el-table-column label="操作" width="120" align="center">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      style="margin-top: 20px; justify-content: flex-end"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :current-page="queryParams.page"
      :page-size="queryParams.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
    />

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="formTitle" width="560px">
      <el-form :model="emp" :rules="rules" ref="empFormRef" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="emp.name" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="emp.username" :disabled="!!emp.id" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="emp.gender">
            <el-radio :value="1">男</el-radio>
            <el-radio :value="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="emp.phone" maxlength="11" />
        </el-form-item>
        <el-form-item label="职位" prop="job">
          <el-select v-model="emp.job" placeholder="请选择">
            <el-option label="班主任" :value="1" />
            <el-option label="讲师" :value="2" />
            <el-option label="学工主管" :value="3" />
            <el-option label="教研主管" :value="4" />
            <el-option label="咨询师" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="薪资">
          <el-input v-model="emp.salary" />
        </el-form-item>
        <el-form-item label="入职日期" prop="entryDate">
          <el-date-picker v-model="emp.entryDate" type="date" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-select v-model="emp.deptId" placeholder="请选择部门">
            <el-option v-for="d in deptList" :key="d.id" :label="d.name" :value="d.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            action="/api/upload"
            :headers="{'token':token}"
            :on-success="handleAvatarSuccess"
            :show-file-list="false"
          >
            <img v-if="emp.image" :src="emp.image" class="avatar" />
            <el-button v-else type="primary">上传头像</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.emp-page { padding: 20px; }
.search-bar { margin-bottom: 20px; display: flex; align-items: center; flex-wrap: wrap; }
.btn-bar { margin-bottom: 15px; }
.avatar { width: 80px; height: 80px; object-fit: cover; border-radius: 4px; }
</style>
