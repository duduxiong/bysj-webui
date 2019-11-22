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
      <el-table-column label="账号" prop="userAccount" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.userAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="userName" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="sex" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机" prop="cellPhone" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.cellPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Email" prop="email" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="超级管理员" prop="superAdmin" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.superAdmin }}</span>
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
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="loadUserData"
    />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="750px">
      <el-form
        size="mini"
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 600px; margin-left:50px;"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="账号">
              <el-input v-model="temp.userAccount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码">
              <el-input v-model="temp.password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名">
              <el-input v-model="temp.userName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="temp.sex">
                <el-radio label="1">男</el-radio>
                <el-radio label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="生日">
              <el-date-picker
                v-model="temp.birthday"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话">
              <el-input v-model="temp.tel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机">
              <el-input v-model="temp.cellPhone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="temp.email"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="启用">
              <el-switch v-model="temp.status"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData()">确定</el-button>
      </div>
    </el-dialog>

    <!--编辑窗口-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="editDialogFormVisible" width="750px">
      <el-form
        size="mini"
        ref="editDataForm"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 600px; margin-left:50px;"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="账号">
              <el-input v-model="temp.userAccount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名">
              <el-input v-model="temp.userName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="temp.sex">
                <el-radio label="1">男</el-radio>
                <el-radio label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生日">
              <el-date-picker v-model="temp.birthday" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="电话">
              <el-input v-model="temp.tel"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机">
              <el-input v-model="temp.cellPhone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="temp.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启用">
              <el-switch v-model="temp.status"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData()">确定</el-button>
      </div>
    </el-dialog>
    <!--授权窗口-->
    <el-dialog :title="authUserName" :visible.sync="authorDialogFormVisible">
      <el-table
        v-loading="listLoading"
        :data="roleData"
        border
        fit
        highlight-current-row
        ref="authorTable"
        row-key="id"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column label="角色名称" prop="roleName" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.roleName }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="authorDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="accredit()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  list,
  add,
  update,
  deleteById,
  author,
  getUserRoles
} from "@/api/user";
import { getRoleList } from "@/api/role";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      list: null,
      roleData: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      },

      dialogFormVisible: false,
      editDialogFormVisible: false,
      authorDialogFormVisible: false,
      temp: {
        id: null,
        userAccount: "",
        password: "",
        userName: "",
        sex: "1",
        birthday: "",
        tel: "",
        cellPhone: "",
        email: "",
        status: true
      },
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增"
      },
      authUserName: "",
      currentUserId: ""
    };
  },
  created() {
    this.loadUserData();
  },
  methods: {
    resetTemp() {
      this.temp = {
        id: null,
        userAccount: "",
        password: "",
        userName: "",
        sex: "1",
        birthday: "",
        tel: "",
        cellPhone: "",
        email: "",
        status: true
      };
    },
    loadUserData() {
      this.listLoading = true;
      list(this.listQuery).then(response => {
        this.list = response.data.data;
        this.total = response.data.total;
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
    loadRoleList() {
      getRoleList().then(response => {
        this.roleData = response.data;
      })
    },
    authorDialogClose() {
      this.$refs.authorTable.clearSelection(
        this.$refs["authorTable"].selection
      );

    },

    handleAccredit(row) {
      this.authUserName = row.userName;
      this.currentUserId = row.id;
      this.roleData = null;
      getRoleList().then(response => {
        this.roleData = response.data;
        getUserRoles(this.currentUserId).then(response => {
          for (var j = 0; j < response.data.length; j++) {
            for (var i = 0; i < this.roleData.length; i++) {
              var roleDataItem = this.roleData[i];
              if (response.data[j] === roleDataItem.id) {
                this.$refs.authorTable.toggleRowSelection(
                  this.roleData[i],
                  true
                );
              }
            }
          }
        });
      });
      this.authorDialogFormVisible = true;
    },
    accredit() {
      this.getSelectionRows();
    },
    handleUpdate(row) {
      this.resetTemp();
      this.temp.id = row.id;
      this.temp.userAccount = row.userAccount;
      this.temp.userName = row.userName;
      this.temp.sex = row.sex;
      this.temp.birthday = row.birthday;
      this.temp.tel = row.tel;
      this.temp.cellPhone = row.cellPhone;
      this.temp.email = row.email;
      this.temp.status = row.status;
      this.editDialogFormVisible = true;
      this.dialogStatus = "update";
      this.$nextTick(() => {
        this.$refs["editDataForm"].clearValidate();
      });
    },
    handleDelete(row) {
      deleteById(row.id).then(response => {
        this.$notify({
          title: "Success",
          message: response.message,
          type: "success",
          duration: 2000
        });
        this.loadUserData();
      });
    },
    createData() {
      add(this.temp).then(response => {
        this.$notify({
          title: "Success",
          message: response.message,
          type: "success",
          duration: 2000
        });
        this.loadUserData();
        this.dialogFormVisible = false;
      });
    },
    updateData() {
      update(this.temp).then(response => {
        this.$notify({
          title: "Success",
          message: response.message,
          type: "success",
          duration: 2000
        });
        this.loadUserData();
        this.editDialogFormVisible = false;
      });
    },
    getSelectionRows() {
      var selectionIds = [];
      this.$refs["authorTable"].selection.forEach(function(r) {
        selectionIds.push(r.id);
      });
      var userRoles = {
        id: this.currentUserId,
        roleList: selectionIds
      };

      author(userRoles).then(response => {
        this.loadUserData();
        this.authorDialogFormVisible = false;
        this.$notify({
          title: "Success",
          message: response.message,
          type: "success",
          duration: 2000
        });
      });
    }
  }
};
</script>