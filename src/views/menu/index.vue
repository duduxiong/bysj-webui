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
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleUpdate"
      >编辑</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="danger"
        icon="el-icon-remove-outline"
        @click="handleDelete"
      >删除</el-button>
    </div>
    <el-tree
      :data="list"
      default-expand-all
      node-key="id"
      label="menuName"
      ref="tree"
      highlight-current
      :props="defaultProps"
      :expand-on-click-node="false"
    ></el-tree>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="父级节点">{{temp.parentName}}</el-form-item>
        <el-form-item label="名称">
          <el-input v-model="temp.menuName"></el-input>
        </el-form-item>
        <el-form-item label="编码">
          <el-input v-model="temp.menuCode"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="temp.url"></el-input>
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
  </div>
</template>
<script>
import {
  getMenuList,
  addMenu,
  getMenuById,
  updateMenuById,
  deleteMenuById
} from "@/api/menu";
import { getInfo } from "@/api/user";

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      defaultProps: {
        children: "children",
        label: "menuName"
      },

      temp: {
        parentId: "",
        parentName: "",
        menuName: "",
        menuCode: "",
        url: "",
        status: true
      },
      dialogFormVisible: false,
      dialogStatus: "",
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
      }
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      getMenuList().then(response => {
        this.list = response.data;
      });
    },
    resetTemp() {
      this.temp = {
        parentId: "",
        parentName: "2222",
        menuName: "",
        menuCode: "",
        url: "",
        status: true
      };
    },
    handleCreate() {
      var currentNode = this.$refs["tree"].getCurrentNode();
      if (currentNode == null) {
        this.$message.warning("请选择目标节点");
        return;
      }
      this.resetTemp();
      this.temp.parentId = currentNode.id;
      this.temp.parentName = currentNode.menuName;
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleUpdate() {
      var currentNode = this.$refs["tree"].getCurrentNode();
      if (currentNode == null) {
        this.$message.warning("请选择目标节点");
        return;
      }
      this.resetTemp();
      getMenuById(currentNode.id).then(response => {
        var menuNode = response.data;
        this.temp.id = menuNode.id;
        this.temp.menuName = menuNode.menuName;
        this.temp.menuCode = menuNode.menuCode;
        this.temp.url = menuNode.url;
        this.temp.status = menuNode.status;
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      });
    },
    handleDelete() {
      var currentNode = this.$refs["tree"].getCurrentNode();
      if (currentNode == null) {
        this.$message.warning("请选择目标节点");
        return;
      }


            this.$confirm("确定要删除该菜单吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await  deleteMenuById(currentNode.id).then(response => {
        this.loadData();
        this.$notify({
          title: "Success",
          message: response.message,
          type: "success",
          duration: 2000
        })
      })
        })
        .catch(err => {
          console.error(err);
        });


    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);

          updateMenuById(tempData).then(response => {
            this.loadData();
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: response.message,
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    createData() {
      addMenu(this.temp).then(response => {
        this.$notify({
          title: "Success",
          message: response.message,
          type: "success",
          duration: 2000
        });
        this.dialogFormVisible = false;
        this.loadData();
      });
    }
  }
};
</script>
