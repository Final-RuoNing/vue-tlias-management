import request from '@/utils/request';

//查询全部部门数据
export const queryAllApi = () => {
    return request.get('/depts');
}
//新增部门数据
export const addApi = (dept) => {
    return request.post('/depts', dept);
}

//根据ID查询部门数据
export const queryByIdApi = (id) => {
    return request.get(`/depts/${id}`);
}
//修改
export const upDateApi=(dept)=>request.put('/depts',dept);
//删除
export const deleteApi=(id)=>request.delete('/depts', { params: { id } });