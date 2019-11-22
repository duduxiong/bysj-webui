<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="handleCreate"
      >新增</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column label="名称" prop="roleName" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sortCode" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.sortCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="success" @click="handleAccredit(row)">授权</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="名称">
          <el-input v-model="temp.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="temp.remark"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="temp.sortCode"></el-input>
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="temp.status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="authRoleName" :visible.sync="authFormVisible">
      <el-tree
        :data="treeData"
        default-expand-all
        node-key="id"
        label="menuName"
        ref="tree"
        highlight-current
        show-checkbox
        :props="defaultProps"
        :expand-on-click-node="false"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="authFormVisible = false">取消</el-button>
        <el-button type="primary" @click="accredit()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  findRoleById,
  updateRoleById,
  deleteRoleById,
  addRole,
  author,
  getRoleMenuList
} from "@/api/role";
import { getMenuList } from "@/api/menu";
export default {
  data() {
    return {
      list: null,
      listLoading: false,
      dialogFormVisible: false,
      dialogStatus: "",
      temp: {
        roleName: "",
        remark: "",
        sortCode: "",
        status: true,
        parentId: "-"
      },
      textMap: {
        update: "编辑",
        create: "新增"
      },
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" }
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change"
          }
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" }
        ]
      },
      //授权信息变量
      defaultProps: {
        children: "children",
        label: "menuName"
      },
      authFormVisible: false,
      treeData: null,
      authRoleName: "",
      currentRoleId: ''
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadMenu() {
      getMenuList().then(response => {
        this.treeData = response.data;
      });
    },
    resetTemp() {
      this.temp = {
        id: null,
        roleName: "",
        remark: "",
        sortCode: 1000,
        status: true,
        parentId: "-"
      };
    },
    loadData() {
      this.listLoading = true;
      getRoleList().then(Response => {
        this.list = Response.data;
        this.listLoading = false;
      });
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      this.resetTemp();
      this.temp.id = row.id;
      this.temp.parentId = row.parentId;
      this.temp.roleName = row.roleName;
      this.temp.remark = row.remark;
      this.temp.status = row.status;
      this.dialogFormVisible = true;
      this.dialogStatus = "update";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleDelete(row) {
      this.$confirm("确定要删除该角色吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await deleteRoleById(row.id).then(response => {
            this.loadData();
            this.$notify({
              title: "Success",
              message: response.message,
              type: "success",
              duration: 2000
            });
          });
        })
        .catch(err => {
          console.error(err);
        });
    },
    handleAccredit(row) {
      this.loadMenu();
      this.authRoleName = "授权 - " + row.roleName;
      this.currentRoleId = row.id;
      this.authFormVisible = true;
      this.treeData = null;
      

      getRoleMenuList(this.currentRoleId).then(response => {
        var roleMenuData = response.data;
        if(roleMenuData!=null && roleMenuData.length>0){
          this.$refs["tree"].setCheckedKeys(roleMenuData)
        }else{
          this.$refs["tree"].setCheckedKeys([]);
        }
      })
    },
    createData() {
      addRole(this.temp).then(response => {
        this.loadData();
        this.resetTemp();
        this.dialogFormVisible = false;
        this.$notify({
          title: "Success",
          message: response.message,
          type: "success",
          duration: 2000
        });
      });
    },
    updateData() {
      updateRoleById(this.temp).then(response => {
        this.loadData();
        this.dialogFormVisible = false;
        this.resetTemp();
        this.$notify({
          title: "Success",
          message: response.message,
          type: "success",
          duration: 2000
        });
      });
    },
    accredit(){
      var checkedNodes = this.$refs["tree"].getCheckedKeys(false)
      var linkNodes = this.$refs["tree"].getHalfCheckedKeys()
      var nodesList = checkedNodes.concat(linkNodes);
      var req = {
        id: this.currentRoleId,
        menuIds: nodesList
      }
      author(req).then(response=>{
        this.$notify({
          title: "Success",
          message: response.message,
          type: "success",
          duration: 2000
        })
      })
      this.authFormVisible = false
      this.currentRoleId = ""
    }
  }
};
</script>