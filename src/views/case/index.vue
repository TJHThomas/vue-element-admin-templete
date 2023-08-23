<template>
  <div class="container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="案例名"
        style="width: 200px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" v-waves
                 style="margin-left:10px;" @click="handleFilter">查询
      </el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-document-add"
                 style="margin-left: 5px"
                 @click="handleCreate">
        新增
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
      />
      <el-table-column
        label="案例名"
        align="center"
      >
        <template v-slot="{ row: { titleWrapper } }">
          <span v-html="titleWrapper"/>
        </template>
      </el-table-column>
      <el-table-column
        label="案例主图"
        align="center"
      >
        <template v-slot="{ row: { theme_img } }">
          <el-image :src="theme_img"></el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="点击数"
        align="center"
        width="100"
      >
        <template v-slot="{ row: { count } }">
          <span>{{ count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createDate" width="200" align="center">
        <template v-slot="{row: {createDate}}">
          <span>{{ createDate | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updateDate" width="200" align="center">
        <template v-slot="{row: {updateDate}}">
          <span>{{ updateDate | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="120"
        align="center"
        fixed="right"
      >
        <template v-slot="{row}">
          <el-button type="text" icon="el-icon-edit" @click="handleUpdate(row)"/>
          <el-button type="text" icon="el-icon-delete" style="color:#f56c6c" @click="handleDelete(row)"/>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total='total'
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination/index.vue";
import waves from "@/directive/waves";
import {listCase, deleteCase} from "@/api/case"
import {parseTime} from "@/utils";

export default {
  name: "case",
  components: {Pagination},
  directives: {waves},
  filters: {
    valueFilter(value) {
      return value || '无'
    },
    timeFilter(time) {
      return time ? parseTime(time, '{y}-{m}-{d} {h}:{i}') : '无'
    }
  },
  data() {
    return {
      listQuery: {},
      listLoading: false,
      tableKey: 0,
      list: [],
      total: 0
    }
  },
  created() {
    this.parseQuery()
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleDelete(row) {
      this.$confirm('此操作将永久删除该数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCase(row.id).then(response => {
          this.$notify({
            title: '成功',
            message: response.msg || '删除成功',
            type: 'success',
            duration: 2000
          })
          this.handleFilter()
        })
      })
    },
    parseQuery() {
      let listQuery = {
        page: 1,
        pageSize: 20,
        sort: '-id'
      }
      this.listQuery = {...listQuery, ...this.listQuery}
    },
    handleUpdate(row) {
      this.$router.push(`/case/createOrEdit/${row.id}`)
    },
    wrapperKeyword(k, v) {
      function highlight(value) {
        return `<span style="color: #1890ff">${value}</span>`
      }

      if (!this.listQuery[k]) {
        return v
      } else {
        return v.replace(new RegExp(this.listQuery[k], 'ig'), v => highlight(v))
      }
    },
    getList() {
      this.listLoading = true
      listCase(this.listQuery).then(response => {
        const {list, count} = response.data
        this.total = count
        this.list = list
        this.listLoading = false
        this.list.forEach(caseItem => {
          caseItem.titleWrapper = this.wrapperKeyword('title', caseItem.title)
        })
      })
    },
    handleFilter() {
      this.getList()
    },
    handleCreate() {
      this.$router.push('/case/createOrEdit/0')
    },
    sortChange(data) {
      const {prop, order} = data
      this.sortBy(prop, order)
    },
    sortBy(prop, order) {
      if (order === 'ascending') {
        this.listQuery.sort = `+${prop}`
      } else {
        this.listQuery.sort = `-${prop}`
      }
      this.handleFilter()
    }
  }
}
</script>

<style scoped>
.container {
  margin: 16px;
}
</style>
