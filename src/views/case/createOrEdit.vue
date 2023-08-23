<template>
  <div class="container">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="案例标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="案例主图" prop="theme_img">
        <el-upload
          :file-list="file_list"
          :on-remove="removeImage"
          :on-exceed="exceedImage"
          :on-preview="handlePictureCardPreview"
          action="https://up-z2.qiniup.com"
          :data="qiniuForm"
          list-type="picture-card"
          :class="{hide:hideUpload}"
          :before-upload="quillImgBefore"
          :on-success="uploadEditorSuccess"
          :on-error="uploadEditorError"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <UE @onEditorChange="onEditorChange" :content="content"/>
      <el-form-item class="container_btn">
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import UE from '@/components/UE.vue'
import {queryOneCase, addOrEditCase} from "@/api/case";
import {getToken} from "@/api/qiniu";

export default {
  components: {
    UE
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      rules: {
        title: [
          {required: true, message: '请输入标题名字', trigger: 'blur'}
        ],
        theme_img:[
          {required: true}
        ]
      },
      hideUpload: false,
      form: {
        title: ''
      },
      theme_img: '',
      file_list: '',
      content: '',
      id: 0,
      qiniuForm: {
        'key': '',   // 上传七牛云的key值防止重复
        'token': '',     // 后端生成的token
        'domain': ''   // 你的七牛云域名
      },
    }
  },
  async created() {
    this.id = this.$route.params.id
    const id = this.id
    this.qiniuForm.key = new Date().getTime() + "" + Math.floor(Math.random() * 1000);
    this.qiniuForm.token = (await getToken()).data;
    this.qiniuForm.domain = 'http://lebetter.gainwell.com'

    if (!!+id) {
      queryOneCase(id).then(response => {
        const {title, theme_img,content} = response.data
        this.form.title = title
        this.content = content
        this.theme_img = theme_img
        this.file_list = [{'name': 'theme_img',url: theme_img}]
        this.hideUpload = true
      })
    }
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    removeImage() {
      this.theme_img = ''
      this.hideUpload = false
    },
    exceedImage() {
      this.$message.warning('只能上传一个案例主图')
    },
    uploadEditorSuccess(res, file) {
      this.theme_img = this.qiniuForm.domain + '/' + res.key
      this.hideUpload = true
      this.$message.success('上传成功')
    },
    uploadEditorError(res) {
      this.$message.warning('上传失败！信息：' + res)
    },
    quillImgBefore(file) {
      let fileType = file.type
      if (fileType === 'image/jpeg' || fileType === 'image/png') {
        return true
      } else {
        this.$message.error('请插入图片类型文件(jpg/jpeg/png)')
        return false
      }
    },
    onEditorChange(content) {
      this.content = content
    },
    onSubmit() {
      const title = this.form.title
      const content = this.content
      const theme_img = this.theme_img
      const id = this.id
      if (!content || !title || !theme_img) {
        this.$message.warning('存在未填写的资料，请填写')
        return
      }
      addOrEditCase(id, title,theme_img, content).then(response => {
        this.$notify({
          title: '成功',
          message: response.msg || '操作成功',
          type: 'success',
          duration: 2000
        })
        this.$router.push('/case/index')
      })
    }
  }
}
</script>

<style scoped>
.container {
  width: 92%;
  margin: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container_btn {
  margin-top: 20px;
  float: right;
}

/deep/ .hide .el-upload--picture-card {
  display: none;
}
</style>
