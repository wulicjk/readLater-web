export function resMessage(res,vm) {
  if (res.code === 0) {
    vm.$message({
      message: res.msg,
      type: 'success'
    })
  }else {
    vm.$message({
      message: res.msg,
      type: 'error'
    })
  }
}
