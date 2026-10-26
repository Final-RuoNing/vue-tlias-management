<script setup>
import axios from 'axios';
import { ref ,onMounted} from 'vue';
import {queryAllApi, addApi, queryByIdApi, upDateApi,deleteApi} from '@/api/dept.js'
import { ElMessage, ElMessageBox } from 'element-plus';
//onMounted钩子函数
onMounted(()=>{
  search();
})

//查询
const search=async()=>{
  /* const result=await axios.get('https://m1.apifoxmock.com/m2/8940106-8743282-default/525643236');
  if(result.data.code==1){
    deptList.value=result.data.data
  } */
  const result=await queryAllApi();
  if(result.code==1){
    deptList.value=result.data;
}
}
// 模拟数据：等后端接口好了，这里换成 axios 请求
const deptList = ref([]);


// 编辑：row 就是这一行的数据
const handleEdit = async (row) => {
  console.log('编辑', row)
  formTitle.value = '编辑部门';
  dept.value = { ...row };
  const result = await queryByIdApi(row.id);
  if (result.code == 1) {
    // 将查询到的部门数据赋值给 dept
    dept.value = result.data;
    dialogVisible.value = true;
  } else {
    ElMessage.error(result.msg);
  }
}// 删除：row 就是这一行的数据
const handleDelete = (row) => {
  console.log('删除', row)
  //弹出确认框
  ElMessageBox.confirm(`确认删除部门 ${row.name} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    //async: true // 异步模式，点击确定后不会立即关闭弹窗
  }).then(async () => {//.then()方法表示点击确定后执行的操作，.catch()方法表示点击取消后执行的操作
    //点击确定后执行删除操作
    try {
      const result = await deleteApi(row.id);
      if (result.code == 1) {
        ElMessage.success('删除部门成功');
        search();
      } else {
        ElMessage.error(result.msg || '删除失败');
      }
    } catch (err) {
      console.error('删除部门请求异常：', err);
      ElMessage.error('删除请求失败，HTTP状态码：' + err?.response?.status + '，请检查后端服务');
    }
  }).catch(() => {
    //点击取消后不做任何操作
  });
}

//对话框可见性函数
const dialogVisible = ref(false);

const formTitle = ref('');

// 弹窗表单数据
const dept = ref({
  name: ''
})

// 表单校验规则
const rules = ref({
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 10, message: '部门名称的长度在2-10之间', trigger: 'blur' }
  ]
})

// 表单 ref，用于手动触发校验
const deptFormRef = ref()

const adddept = () => {
  dialogVisible.value = true;
  formTitle.value = '新增部门';
  dept.value = {
    name: ''
  }
  //重置表单的校验规则-提示信息
if (deptFormRef.value) {
  deptFormRef.value.resetFields();
}
}

const save = async () => {
  // 表单校验，通过后才提交
  deptFormRef.value.validate(async (valid) => {
    if (valid) {
      
      let result;
      if(dept.value.id){
        //修改
        result=await upDateApi(dept.value);
      }else{
        //新增
        result=await addApi(dept.value);
      }
      if (result.code == 1) {
        ElMessage.success('新增部门成功');
        dialogVisible.value = false;
        search();
      } else {
        ElMessage.error(result.msg);
      }
    }
  })
}

// 表单 label 宽度
const formLabelWidth = '100px'

// 关闭弹窗前的回调
const handleClose = (done) => {
  done()
}

</script>

<template>
  <div class="dept-page">
    <!-- 标题 + 新增按钮 -->
    <div class="dept-header">
      <span class="dept-title">部门管理</span>
      <el-button type="primary" @click="adddept">
        <el-icon><Plus /></el-icon>新增部门
      </el-button>
    </div>

    <!-- 部门信息表格 -->
    <el-table :data="deptList" border stripe>
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="name" label="部门名称" />
      <el-table-column prop="createTime" label="最后操作时间" />
      <el-table-column label="操作" width="160" align="center">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog
    v-model="dialogVisible"
    :title="formTitle"
    width="500"
    :before-close="handleClose"
  >
    <el-form :model="dept" :rules="rules" ref="deptFormRef">
      <el-form-item label="部门名称" prop="name" :label-width="formLabelWidth">
        <el-input v-model="dept.name" autocomplete="off" />
      </el-form-item>
      
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
  </div>
</template>

<style scoped>
.dept-page {
  padding: 20px;
}

.dept-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dept-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}
</style>
