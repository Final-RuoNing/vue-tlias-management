import request from '@/utils/request';

// 分页查询员工
export const pageApi = (params) => {
    return request.get('/emps', { params });
}

// 新增员工
export const addApi = (emp) => {
    return request.post('/emps', emp);
}

// 根据id查询员工
export const getByIdApi = (id) => {
    return request.get(`/emps/${id}`);
}

// 修改员工
export const updateApi = (emp) => {
    return request.put('/emps', emp);
}

// 批量删除员工（ids 是数组，后端用 @RequestParam List<Integer> 接收，需要拼成 ids=1&ids=2）
export const deleteBatchApi = (ids) => {
    const query = ids.map(id => `ids=${id}`).join('&');
    return request.delete(`/emps?${query}`);
}
