<template>
  <div class="excel-upload">
    <!-- 三个上传卡片容器 -->
    <!-- 解析遮罩层 -->
    <div v-if="isParsing" class="parsing-mask">
      <div class="parsing-content">
        <i class="el-icon-loading"></i>
        <p>文件正在解析中，请稍候...</p>
      </div>
    </div>

    <el-row :gutter="20" class="upload-row">
      <!-- 员工花名册上传 -->
      <el-col :span="8">
        <el-card class="upload-card">
          <div slot="header" class="clearfix">
            <span>员工花名册上传</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="downloadRosterTemplate">
              下载模板
            </el-button> -->
          </div>

          <el-upload class="upload-demo" drag :action="rosterUploadUrl" :headers="uploadHeaders"
            :data="rosterUploadData" :show-file-list="false" :before-upload="handleRosterBeforeUpload"
            :on-progress="handleRosterProgress" :on-success="handleRosterSuccess" :on-error="handleRosterError"
            accept=".xlsx,.xls,.xlsm,.xlsb,.csv" :multiple="false" name="roster_file">
            <div v-if="!rosterUploading" class="default-upload-area">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将员工花名册文件拖到此处，或 <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">
                支持 .xlsx, .xls, .xlsm, .xlsb, .csv 格式，文件不超过 20MB
              </div>
            </div>

            <!-- 上传中区域 -->
            <div v-else class="uploading-area">
              <i class="el-icon-upload"
                :class="rosterUploadStatus === 'success' ? 'success-icon' : rosterUploadStatus === 'exception' ? 'error-icon' : ''"></i>
              <div class="el-upload__text">
                <span v-if="rosterUploadProgress < 100">上传中...</span>
                <span v-else-if="rosterUploadStatus === 'success'">上传成功！</span>
                <span v-else>上传失败</span>
              </div>

              <!-- 进度条 -->
              <div class="upload-progress-container">
                <el-progress :percentage="rosterUploadProgress" :status="rosterUploadStatus" :stroke-width="12"
                  :show-text="false" style="margin-top: 20px;" />
                <div class="progress-info">
                  <span class="progress-percentage">{{ rosterUploadProgress }}%</span>
                  <el-button v-if="rosterUploadProgress < 100" type="text" size="mini" @click.stop="cancelRosterUpload"
                    class="cancel-btn">
                    取消
                  </el-button>
                </div>
                <p class="progress-message">{{ rosterUploadMessage }}</p>
              </div>
            </div>
          </el-upload>

          <!-- 上传结果 -->
          <div v-if="rosterUploadResult && !rosterUploading" class="result-area">
            <el-alert :title="rosterUploadResult.title" :type="rosterUploadResult.type"
              :description="rosterUploadResult.description" :closable="false" show-icon />
          </div>
        </el-card>
      </el-col>

      <!-- 新员工入职表上传 -->
      <el-col :span="8">
        <el-card class="upload-card">
          <div slot="header" class="clearfix">
            <span>新员工入职表上传</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="downloadNewEmployeeTemplate">
              下载模板
            </el-button> -->
          </div>

          <el-upload class="upload-demo" drag :action="newEmployeeUploadUrl" :headers="uploadHeaders"
            :data="newEmployeeUploadData" :show-file-list="false" :before-upload="handleNewEmployeeBeforeUpload"
            :on-progress="handleNewEmployeeProgress" :on-success="handleNewEmployeeSuccess"
            :on-error="handleNewEmployeeError" accept=".xlsx,.xls,.xlsm,.xlsb,.csv" :multiple="false"
            name="new_employee_file">
            <div v-if="!newEmployeeUploading" class="default-upload-area">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将新员工入职表拖到此处，或 <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">
                支持 .xlsx, .xls, .xlsm, .xlsb, .csv 格式，文件不超过 20MB
              </div>
            </div>

            <!-- 上传中区域 -->
            <div v-else class="uploading-area">
              <i class="el-icon-upload"
                :class="newEmployeeUploadStatus === 'success' ? 'success-icon' : newEmployeeUploadStatus === 'exception' ? 'error-icon' : ''"></i>
              <div class="el-upload__text">
                <span v-if="newEmployeeUploadProgress < 100">上传中...</span>
                <span v-else-if="newEmployeeUploadStatus === 'success'">上传成功！</span>
                <span v-else>上传失败</span>
              </div>

              <!-- 进度条 -->
              <div class="upload-progress-container">
                <el-progress :percentage="newEmployeeUploadProgress" :status="newEmployeeUploadStatus"
                  :stroke-width="12" :show-text="false" style="margin-top: 20px;" />
                <div class="progress-info">
                  <span class="progress-percentage">{{ newEmployeeUploadProgress }}%</span>
                  <el-button v-if="newEmployeeUploadProgress < 100" type="text" size="mini"
                    @click.stop="cancelNewEmployeeUpload" class="cancel-btn">
                    取消
                  </el-button>
                </div>
                <p class="progress-message">{{ newEmployeeUploadMessage }}</p>
              </div>
            </div>
          </el-upload>

          <!-- 上传结果 -->
          <div v-if="newEmployeeUploadResult && !newEmployeeUploading" class="result-area">
            <el-alert :title="newEmployeeUploadResult.title" :type="newEmployeeUploadResult.type"
              :description="newEmployeeUploadResult.description" :closable="false" show-icon />
          </div>
        </el-card>
      </el-col>

      <!-- 调令上传 -->
      <el-col :span="8">
        <el-card class="upload-card">
          <div slot="header" class="clearfix">
            <span>调令上传</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="downloadTransferTemplate">
              下载示例
            </el-button> -->
          </div>

          <el-upload class="upload-demo" drag :action="transferUploadUrl" :headers="uploadHeaders"
            :data="transferUploadData" :show-file-list="false" :before-upload="handleTransferBeforeUpload"
            :on-progress="handleTransferProgress" :on-success="handleTransferSuccess" :on-error="handleTransferError"
            accept=".pdf" :multiple="false" name="transfer_file">
            <div v-if="!transferUploading" class="default-upload-area">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将调令文件拖到此处，或 <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">
                支持 .pdf 格式，文件不超过 20MB
              </div>
            </div>

            <!-- 上传中区域 -->
            <div v-else class="uploading-area">
              <i class="el-icon-upload"
                :class="transferUploadStatus === 'success' ? 'success-icon' : transferUploadStatus === 'exception' ? 'error-icon' : ''"></i>
              <div class="el-upload__text">
                <span v-if="transferUploadProgress < 100">上传中...</span>
                <span v-else-if="transferUploadStatus === 'success'">上传成功！</span>
                <span v-else>上传失败</span>
              </div>

              <!-- 进度条 -->
              <div class="upload-progress-container">
                <el-progress :percentage="transferUploadProgress" :status="transferUploadStatus" :stroke-width="12"
                  :show-text="false" style="margin-top: 20px;" />
                <div class="progress-info">
                  <span class="progress-percentage">{{ transferUploadProgress }}%</span>
                  <el-button v-if="transferUploadProgress < 100" type="text" size="mini"
                    @click.stop="cancelTransferUpload" class="cancel-btn">
                    取消
                  </el-button>
                </div>
                <p class="progress-message">{{ transferUploadMessage }}</p>
              </div>
            </div>
          </el-upload>

          <!-- 上传结果 -->
          <div v-if="transferUploadResult && !transferUploadUploading" class="result-area">
            <el-alert :title="transferUploadResult.title" :type="transferUploadResult.type"
              :description="transferUploadResult.description" :closable="false" show-icon />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 错误详情弹窗 -->
    <el-dialog :visible.sync="errorDialogVisible" title="上传失败" width="500px">
      <div v-html="errorMessage"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="errorDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="retryUpload">重试</el-button>
      </span>
    </el-dialog>

    <!-- 员工数据表格 -->
    <el-card class="data-table-card" style="margin-top: 20px;">
      <div slot="header" class="clearfix">
        <span>员工花名册 (共 {{ filteredEmployeeData.length }} 条记录)</span>
        <div style="float: right;">
          <!-- 列显示控制 -->
          <el-button type="info" icon="el-icon-s-operation" @click="columnDialogVisible = true"
            size="small">列配置</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="loadAllEmployeeData" size="small"
            :loading="tableLoading">刷新</el-button>
        </div>
      </div>

      <!-- 搜索和筛选 -->
      <div class="table-toolbar">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model="searchKeyword" placeholder="搜索..." clearable prefix-icon="el-icon-search"
              @input="handleSearch" @clear="handleSearch" />
          </el-col>
          <el-col :span="6">
            <el-select v-model="filterDepartment" placeholder="按部门筛选" clearable style="width: 100%;"
              @change="handleFilter">
              <el-option v-for="dept in departmentOptions" :key="dept" :label="dept" :value="dept" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="filterGender" placeholder="按性别筛选" clearable style="width: 100%;" @change="handleFilter">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd" style="width: 100%;">添加员工</el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 数据表格 -->
      <div class="editable-table-container">
        <el-table :data="currentPageData" border stripe style="width: 100%" v-loading="tableLoading"
          :default-sort="{ prop: 'created_at', order: 'descending' }" height="600" :row-class-name="tableRowClassName">
          <!-- 序号列 -->
          <el-table-column type="index" label="#" width="60" align="center" fixed>
            <template slot-scope="scope">
              {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>

          <!-- 根据数据库结构动态生成所有列 -->
          <template v-for="column in visibleColumns">
            <el-table-column v-if="column.visible" :key="column.key" :prop="column.key" :label="column.label"
              :min-width="column.minWidth || 120" :sortable="column.sortable !== false" :fixed="column.fixed || false"
              :align="column.align || 'left'" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <!-- 编辑状态 -->
                <template v-if="scope.row.editing && column.editable">
                  <!-- 文本输入框 -->
                  <el-input v-if="column.type === 'text' || !column.type" v-model="scope.row[column.key]"
                    :placeholder="`请输入${column.label}`" size="small" @keyup.enter="handleSave(scope.row)" />

                  <!-- 数字输入框 -->
                  <el-input-number v-else-if="column.type === 'number'" v-model="scope.row[column.key]"
                    :placeholder="`请输入${column.label}`" size="small" controls-position="right" style="width: 100%;" />

                  <!-- 日期选择器 -->
                  <el-date-picker v-else-if="column.type === 'date'" v-model="scope.row[column.key]" type="date"
                    :placeholder="`选择${column.label}`" value-format="yyyy-MM-dd" size="small" style="width: 100%;" />

                  <!-- 选择器 -->
                  <el-select v-else-if="column.type === 'select'" v-model="scope.row[column.key]"
                    :placeholder="`请选择${column.label}`" size="small" style="width: 100%;">
                    <el-option v-for="option in getSelectOptions(column.key)" :key="option" :label="option"
                      :value="option" />
                  </el-select>

                  <!-- 多行文本框 -->
                  <el-input v-else-if="column.type === 'textarea'" v-model="scope.row[column.key]" type="textarea"
                    :rows="2" :placeholder="`请输入${column.label}`" size="small" />

                  <!-- 开关 -->
                  <el-switch v-else-if="column.type === 'switch'" v-model="scope.row[column.key]" active-value="是"
                    inactive-value="否" active-text="是" inactive-text="否" size="small" />
                </template>

                <!-- 非编辑状态 -->
                <template v-else>
                  <!-- 特殊格式处理 -->
                  <template v-if="column.type === 'date'">
                    {{ formatDate(scope.row[column.key]) }}
                  </template>
                  <template v-else-if="column.type === 'datetime'">
                    {{ formatDateTime(scope.row[column.key]) }}
                  </template>
                  <template v-else-if="column.key === 'gender'">
                    <el-tag :type="scope.row[column.key] === '男' ? 'primary' : 'danger'" size="small">
                      {{ scope.row[column.key] }}
                    </el-tag>
                  </template>
                  <template
                    v-else-if="column.type === 'boolean' || column.key.includes('is_') || column.key.includes('talent')">
                    <el-tag :type="scope.row[column.key] === '是' ? 'success' : 'info'" size="small">
                      {{ scope.row[column.key] || '否' }}
                    </el-tag>
                  </template>
                  <template v-else-if="column.type === 'link' && scope.row[column.key]">
                    <a :href="'mailto:' + scope.row[column.key]" class="email-link">
                      {{ scope.row[column.key] }}
                    </a>
                  </template>
                  <template v-else>
                    {{ formatCellValue(scope.row[column.key]) }}
                  </template>
                </template>
              </template>
            </el-table-column>
          </template>

          <!-- 操作列 -->
          <el-table-column label="操作" width="200" fixed="right" align="center">
            <template slot-scope="scope">
              <template v-if="scope.row.editing">
                <el-button type="success" icon="el-icon-check" size="small"
                  @click="handleSave(scope.row)">保存</el-button>
                <el-button type="danger" icon="el-icon-close" size="small" @click="cancelEdit(scope.row)">取消</el-button>
              </template>
              <template v-else>
                <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="small"
                  @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="filteredEmployeeData.length" :disabled="tableLoading" />
      </div>

      <!-- 分页信息提示 -->
      <div class="page-info" style="text-align: center; margin-top: 10px; color: #909399; font-size: 12px;">
        当前显示第 {{ currentPage }} 页，每页 {{ pageSize }} 条，共 {{ filteredEmployeeData.length }} 条记录
        <span v-if="filteredEmployeeData.length !== allEmployeeData.length">(已筛选出 {{ filteredEmployeeData.length }}
          条)</span>
      </div>
    </el-card>

    <!-- 列配置对话框 -->
    <el-dialog title="列显示配置" :visible.sync="columnDialogVisible" width="800px">
      <div class="column-config-dialog">
        <!-- 搜索列 -->
        <el-input v-model="columnSearchKeyword" placeholder="搜索列名..." clearable prefix-icon="el-icon-search"
          style="margin-bottom: 20px;" />

        <!-- 全选/全不选 -->
        <div style="margin-bottom: 15px;">
          <el-checkbox v-model="selectAllColumns" :indeterminate="isIndeterminate" @change="handleSelectAllColumns">
            全选/全不选
          </el-checkbox>
          <el-button type="text" @click="resetColumnConfig" style="margin-left: 20px;">恢复默认</el-button>
        </div>

        <!-- 列配置分组 -->
        <div v-for="(group, groupName) in columnGroups" :key="groupName" class="column-group">
          <h4>{{ groupName }}</h4>
          <el-row :gutter="20" class="column-config-grid">
            <el-col v-for="column in group.columns" :key="column.key" :span="8"
              v-show="!columnSearchKeyword || column.key.includes(columnSearchKeyword) || column.label.includes(columnSearchKeyword)">
              <el-checkbox v-model="column.visible" @change="handleColumnChange">
                {{ column.label }}
              </el-checkbox>
            </el-col>
          </el-row>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="columnDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveColumnConfig">保存配置</el-button>
      </span>
    </el-dialog>

    <!-- 添加/编辑员工对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="800px" @close="handleDialogClose">
      <el-form ref="employeeForm" :model="formData" :rules="formRules" label-width="120px" class="employee-form">
        <el-tabs v-model="activeTab">
          <!-- 基础信息标签页 -->
          <el-tab-pane label="基础信息" name="basic">
            <el-row :gutter="20">
              <el-col :span="12" v-for="column in basicColumns" :key="column.key">
                <el-form-item v-if="column.visible" :label="column.label" :prop="column.key">
                  <component :is="getFormComponent(column)" v-model="formData[column.key]"
                    :placeholder="`请输入${column.label}`" style="width: 100%;" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <!-- 人员信息标签页 -->
          <el-tab-pane label="人员信息" name="personnel">
            <el-row :gutter="20">
              <el-col :span="12" v-for="column in personnelColumns" :key="column.key">
                <el-form-item v-if="column.visible" :label="column.label" :prop="column.key">
                  <component :is="getFormComponent(column)" v-model="formData[column.key]"
                    :placeholder="`请输入${column.label}`" style="width: 100%;" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <!-- 身份信息标签页 -->
          <el-tab-pane label="身份信息" name="identity">
            <el-row :gutter="20">
              <el-col :span="12" v-for="column in identityColumns" :key="column.key">
                <el-form-item v-if="column.visible" :label="column.label" :prop="column.key">
                  <component :is="getFormComponent(column)" v-model="formData[column.key]"
                    :placeholder="`请输入${column.label}`" style="width: 100%;" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <!-- 联系信息标签页 -->
          <el-tab-pane label="联系信息" name="contact">
            <el-row :gutter="20">
              <el-col :span="12" v-for="column in contactColumns" :key="column.key">
                <el-form-item v-if="column.visible" :label="column.label" :prop="column.key">
                  <component :is="getFormComponent(column)" v-model="formData[column.key]"
                    :placeholder="`请输入${column.label}`" style="width: 100%;" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <!-- 其他信息标签页 -->
          <el-tab-pane label="其他信息" name="other">
            <el-row :gutter="20">
              <el-col :span="12" v-for="column in otherColumns" :key="column.key">
                <el-form-item v-if="column.visible" :label="column.label" :prop="column.key">
                  <component :is="getFormComponent(column)" v-model="formData[column.key]"
                    :placeholder="`请输入${column.label}`" style="width: 100%;" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 历史记录面板 -->
    <el-drawer title="上传历史记录" :visible.sync="historyDrawer" direction="rtl" size="40%">
      <el-table :data="uploadHistory" style="width: 100%" empty-text="暂无上传记录">
        <el-table-column prop="filename" label="文件名" min-width="150" />
        <el-table-column prop="time" label="上传时间" width="180" />
        <el-table-column prop="type" label="文件类型" width="100" />
        <el-table-column prop="result" label="结果" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.success ? 'success' : 'danger'" size="small">
              {{ scope.row.success ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button v-if="scope.row.success" type="text" size="small" @click="viewDetails(scope.row)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
// 导入axios
import axios from 'axios';

export default {
  name: 'ExcelUpload',
  data() {
    return {
      // 遮罩层状态
      isParsing: false,

      // 上传URL
      rosterUploadUrl: this.$store.state.icd.baseURL + "/api/upload_roster.php",
      newEmployeeUploadUrl: this.$store.state.icd.baseURL + "/api/upload_new_employee.php",
      transferUploadUrl: this.$store.state.icd.baseURL + "/api/upload_transfer.php",

      // 员工花名册上传相关
      rosterUploading: false,
      rosterUploadProgress: 0,
      rosterUploadStatus: '',
      rosterUploadMessage: '',
      rosterUploadResult: null,
      rosterUploadData: {
        upload_type: 'roster',
        timestamp: null
      },

      // 新员工入职表上传相关
      newEmployeeUploading: false,
      newEmployeeUploadProgress: 0,
      newEmployeeUploadStatus: '',
      newEmployeeUploadMessage: '',
      newEmployeeUploadResult: null,
      newEmployeeUploadData: {
        upload_type: 'new_employee',
        timestamp: null
      },

      // 调令上传相关
      transferUploading: false,
      transferUploadProgress: 0,
      transferUploadStatus: '',
      transferUploadMessage: '',
      transferUploadResult: null,
      transferUploadData: {
        upload_type: 'transfer',
        timestamp: null
      },

      // 通用上传相关
      uploadHeaders: {},

      // 错误处理
      errorDialogVisible: false,
      errorMessage: '',

      // 历史记录
      historyDrawer: false,
      uploadHistory: [],

      // 表格相关（前端分页方案）
      allEmployeeData: [], // 存储所有数据
      tableLoading: false,
      currentPage: 1,
      pageSize: 20,
      searchKeyword: '',
      filterDepartment: '',
      filterGender: '',

      // 列配置 - 完全按照数据库结构定义
      columns: [
        // 基础信息字段
        { key: 'id', label: 'ID', visible: false, type: 'number', editable: false, group: '基础信息' },
        { key: 'personnel_code', label: '人员编码', visible: true, type: 'text', editable: true, fixed: true, minWidth: 100, group: '基础信息' },
        { key: 'name', label: '姓名', visible: true, type: 'text', editable: true, fixed: true, minWidth: 100, group: '基础信息' },
        { key: 'name_pinyin', label: '姓名拼音', visible: false, type: 'text', editable: true, group: '基础信息' },
        { key: 'department_attribute', label: '部门属性', visible: true, type: 'text', editable: true, minWidth: 120, group: '基础信息' },
        { key: 'department', label: '部门', visible: true, type: 'select', editable: true, minWidth: 120, group: '基础信息' },
        { key: 'office', label: '科室', visible: true, type: 'text', editable: true, minWidth: 100, group: '基础信息' },
        { key: 'administrative_position', label: '行政职务', visible: true, type: 'text', editable: true, minWidth: 120, group: '基础信息' },
        { key: 'administrative_level', label: '行政级别', visible: true, type: 'text', editable: true, minWidth: 100, group: '基础信息' },
        { key: 'technical_position', label: '技术职务', visible: true, type: 'text', editable: true, minWidth: 120, group: '基础信息' },
        { key: 'position_for_certificate', label: '岗位（用于在职证明）', visible: true, type: 'text', editable: true, minWidth: 150, group: '基础信息' },
        { key: 'position_title_chinese', label: '岗位职务（用于中文在职证明）', visible: true, type: 'text', editable: true, minWidth: 150, group: '基础信息' },
        { key: 'position_title_english', label: '岗位职务（用于英文在职证明）', visible: true, type: 'text', editable: true, minWidth: 150, group: '基础信息' },
        { key: 'actual_position', label: '实际岗位', visible: true, type: 'text', editable: true, minWidth: 120, group: '基础信息' },
        { key: 'sequence', label: '序列', visible: true, type: 'text', editable: true, minWidth: 100, group: '基础信息' },
        { key: 'rank_level', label: '职级', visible: true, type: 'text', editable: true, minWidth: 100, group: '基础信息' },
        { key: 'professional_title_level', label: '职称等级', visible: true, type: 'text', editable: true, minWidth: 100, group: '基础信息' },
        { key: 'technical_title', label: '技术职称', visible: true, type: 'text', editable: true, minWidth: 120, group: '基础信息' },
        { key: 'general_administrative_level', label: '一般行政等级', visible: true, type: 'text', editable: true, minWidth: 120, group: '基础信息' },
        { key: 'skill_level', label: '技能等级', visible: true, type: 'text', editable: true, minWidth: 100, group: '基础信息' },
        { key: 'assessment_date', label: '评定日期', visible: true, type: 'date', editable: true, minWidth: 100, group: '基础信息' },

        // 人员类别信息
        { key: 'personnel_category', label: '人员类别', visible: true, type: 'select', editable: true, minWidth: 100, group: '人员类别信息' },
        { key: 'recruitment_source', label: '招聘来源', visible: true, type: 'text', editable: true, minWidth: 120, group: '人员类别信息' },
        { key: 'highest_education', label: '最高学历', visible: true, type: 'select', editable: true, minWidth: 100, group: '人员类别信息' },
        { key: 'employment_date', label: '到职日期', visible: true, type: 'date', editable: true, minWidth: 100, group: '人员类别信息' },
        { key: 'work_years', label: '工龄', visible: true, type: 'number', editable: true, minWidth: 80, group: '人员类别信息' },
        { key: 'company_years', label: '司龄', visible: true, type: 'number', editable: true, minWidth: 80, group: '人员类别信息' },
        { key: 'gender', label: '性别', visible: true, type: 'select', editable: true, minWidth: 80, group: '人员类别信息' },
        { key: 'ethnicity', label: '民族', visible: true, type: 'text', editable: true, minWidth: 100, group: '人员类别信息' },
        { key: 'birth_date', label: '出生日期', visible: true, type: 'date', editable: true, minWidth: 100, group: '人员类别信息' },
        { key: 'age', label: '年龄', visible: true, type: 'number', editable: true, minWidth: 80, group: '人员类别信息' },
        { key: 'work_start_date', label: '参加工作日期', visible: true, type: 'date', editable: true, minWidth: 120, group: '人员类别信息' },
        { key: 'political_status', label: '政治面貌', visible: true, type: 'text', editable: true, minWidth: 100, group: '人员类别信息' },
        { key: 'political_status_date', label: '政治面貌加入日期', visible: true, type: 'date', editable: true, minWidth: 120, group: '人员类别信息' },

        // 身份信息
        { key: 'id_card', label: '身份证号', visible: true, type: 'text', editable: true, minWidth: 150, group: '身份信息' },
        { key: 'native_place', label: '籍贯', visible: true, type: 'text', editable: true, minWidth: 120, group: '身份信息' },
        { key: 'graduation_date', label: '毕业日期', visible: true, type: 'date', editable: true, minWidth: 100, group: '身份信息' },
        { key: 'education_type', label: '学历类别', visible: true, type: 'text', editable: true, minWidth: 100, group: '身份信息' },
        { key: 'school', label: '学校', visible: true, type: 'text', editable: true, minWidth: 120, group: '身份信息' },
        { key: 'major', label: '所学专业', visible: true, type: 'text', editable: true, minWidth: 120, group: '身份信息' },
        { key: 'rotation_dispatch', label: '轮岗外派情况', visible: true, type: 'textarea', editable: true, minWidth: 150, group: '身份信息' },

        // 联系信息
        { key: 'internal_email', label: '内网邮箱', visible: true, type: 'link', editable: true, minWidth: 150, group: '联系信息' },
        { key: 'comac_external_email', label: '商飞外网邮箱', visible: true, type: 'link', editable: true, minWidth: 150, group: '联系信息' },
        { key: 'non_comac_external_email', label: '非商飞外网邮箱', visible: true, type: 'link', editable: true, minWidth: 150, group: '联系信息' },
        { key: 'mobile_phone', label: '手机号码', visible: true, type: 'text', editable: true, minWidth: 120, group: '联系信息' },

        // 户籍档案信息
        { key: 'is_shanghai_resident', label: '是否上海户籍', visible: true, type: 'switch', editable: true, minWidth: 120, group: '户籍档案信息' },
        { key: 'is_archive_in_company', label: '档案是否在院里保存', visible: true, type: 'switch', editable: true, minWidth: 150, group: '户籍档案信息' },

        // 人才类别
        { key: 'management_talent', label: '经营管理人才', visible: true, type: 'switch', editable: true, minWidth: 120, group: '人才类别' },
        { key: 'professional_technical_talent', label: '专业技术人才', visible: true, type: 'switch', editable: true, minWidth: 120, group: '人才类别' },
        { key: 'skilled_talent', label: '技能人才', visible: true, type: 'switch', editable: true, minWidth: 100, group: '人才类别' },

        // 备注及其他信息
        { key: 'remarks', label: '备注', visible: true, type: 'textarea', editable: true, minWidth: 150, group: '备注及其他信息' },

        // 统计字段
        { key: 'age_group', label: '年龄段', visible: false, type: 'text', editable: false, group: '统计字段' },
        { key: 'education_distribution', label: '学历分布', visible: false, type: 'text', editable: false, group: '统计字段' },
        { key: 'professional_title_stat', label: '职称统计', visible: false, type: 'text', editable: false, group: '统计字段' },
        { key: 'rank_stat', label: '职级统计', visible: false, type: 'text', editable: false, group: '统计字段' },
        { key: 'administrative_technical_stat', label: '行政职务技术等级统计', visible: false, type: 'text', editable: false, group: '统计字段' },
        { key: 'gender_stat', label: '性别统计', visible: false, type: 'text', editable: false, group: '统计字段' },
        { key: 'education_type_stat', label: '学历类别统计', visible: false, type: 'text', editable: false, group: '统计字段' },
        { key: 'functional_management_stat', label: '职能管理人员统计', visible: false, type: 'text', editable: false, group: '统计字段' },

        // 异动信息字段
        { key: 'separation_type', label: '异动类型', visible: false, type: 'text', editable: true, group: '异动信息字段' },
        { key: 'separation_reason', label: '离职原因', visible: false, type: 'text', editable: true, group: '异动信息字段' },
        { key: 'resignation_application_date', label: '离职申请日期', visible: false, type: 'date', editable: true, group: '异动信息字段' },
        { key: 'separation_date', label: '退工单日期', visible: false, type: 'date', editable: true, group: '异动信息字段' },

        // 时间戳字段
        { key: 'created_at', label: '创建时间', visible: true, type: 'datetime', editable: false, minWidth: 150, group: '时间戳字段' },
        { key: 'updated_at', label: '更新时间', visible: false, type: 'datetime', editable: false, minWidth: 150, group: '时间戳字段' }
      ],

      // 部门选项
      departmentOptions: [],

      // 对话框相关
      dialogVisible: false,
      dialogTitle: '添加员工',
      activeTab: 'basic',
      formData: {},
      formRules: {
        personnel_code: [
          { required: true, message: '请输入人员编码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        department: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ]
      },
      editingRowOriginal: null,

      // 列配置对话框
      columnDialogVisible: false,
      columnSearchKeyword: '',
      selectAllColumns: false,
      isIndeterminate: false,

      // 防抖计时器
      searchTimer: null
    };
  },
  computed: {
    // 计算可见列
    visibleColumns() {
      return this.columns.filter(col => col.visible);
    },

    // 按组分列的配置
    columnGroups() {
      const groups = {};
      this.columns.forEach(column => {
        if (!groups[column.group]) {
          groups[column.group] = {
            name: column.group,
            columns: []
          };
        }
        groups[column.group].columns.push(column);
      });
      return groups;
    },

    // 计算过滤后的数据
    filteredEmployeeData() {
      let filtered = this.allEmployeeData;

      // 搜索过滤
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        filtered = filtered.filter(item => {
          // 遍历所有可见列进行搜索
          for (const column of this.visibleColumns) {
            if (item[column.key]) {
              const value = String(item[column.key]).toLowerCase();
              if (value.includes(keyword)) {
                return true;
              }
            }
          }
          return false;
        });
      }

      // 部门过滤
      if (this.filterDepartment) {
        filtered = filtered.filter(item => item.department === this.filterDepartment);
      }

      // 性别过滤
      if (this.filterGender) {
        filtered = filtered.filter(item => item.gender === this.filterGender);
      }

      return filtered;
    },

    // 计算当前页数据
    currentPageData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredEmployeeData.slice(start, end);
    },

    // 对话框字段分组
    basicColumns() {
      return this.columns.filter(col => col.group === '基础信息' && col.visible);
    },

    personnelColumns() {
      return this.columns.filter(col => col.group === '人员类别信息' && col.visible);
    },

    identityColumns() {
      return this.columns.filter(col => col.group === '身份信息' && col.visible);
    },

    contactColumns() {
      return this.columns.filter(col => col.group === '联系信息' && col.visible);
    },

    otherColumns() {
      return this.columns.filter(col =>
        (col.group === '户籍档案信息' ||
          col.group === '人才类别' ||
          col.group === '备注及其他信息' ||
          col.group === '统计字段' ||
          col.group === '异动信息字段' ||
          col.group === '时间戳字段') && col.visible
      );
    }
  },
  watch: {
    // 监听筛选条件变化，重置到第一页
    searchKeyword() {
      this.currentPage = 1;
    },
    filterDepartment() {
      this.currentPage = 1;
    },
    filterGender() {
      this.currentPage = 1;
    },
    // 监听过滤后数据变化，如果当前页超出范围，重置到第一页
    filteredEmployeeData() {
      const totalPages = Math.ceil(this.filteredEmployeeData.length / this.pageSize);
      if (this.currentPage > totalPages && totalPages > 0) {
        this.currentPage = totalPages;
      } else if (totalPages === 0) {
        this.currentPage = 1;
      }
    },
    // 监听列选择状态
    columns: {
      handler() {
        this.updateSelectAllStatus();
      },
      deep: true
    }
  },
  mounted() {
    // 加载历史记录
    this.loadHistory();
    // 加载列配置
    this.loadColumnConfig();
    // 加载所有员工数据
    this.loadAllEmployeeData();
  },
  methods: {
    // 表格行样式
    tableRowClassName({ row }) {
      if (row.editing) {
        return 'editing-row';
      }
      return '';
    },

    // ==================== 员工花名册上传方法 ====================
    handleRosterBeforeUpload(file) {
      return this.handleUploadBefore(file, '.xlsx,.xls,.xlsm,.xlsb,.csv', '员工花名册');
    },

    handleRosterProgress(event, file, fileList) {
      this.handleUploadProgress(event, 'roster');
    },

    handleRosterSuccess(response, file, fileList) {
      this.handleUploadSuccess(response, file, '员工花名册', 'roster');
    },

    handleRosterError(err, file, fileList) {
      this.handleUploadError(err, file, '员工花名册', 'roster');
    },

    cancelRosterUpload() {
      this.rosterUploading = false;
      this.rosterUploadProgress = 0;
      this.rosterUploadMessage = '上传已取消';
      this.$message.info('员工花名册上传已取消');
    },

    downloadRosterTemplate() {
      this.downloadTemplate('员工花名册模板.csv', 'roster');
    },

    // ==================== 新员工入职表上传方法 ====================
    handleNewEmployeeBeforeUpload(file) {
      return this.handleUploadBefore(file, '.xlsx,.xls,.xlsm,.xlsb,.csv', '新员工入职表');
    },

    handleNewEmployeeProgress(event, file, fileList) {
      this.handleUploadProgress(event, 'newEmployee');
    },

    handleNewEmployeeSuccess(response, file, fileList) {
      this.handleUploadSuccess(response, file, '新员工入职表', 'newEmployee');
    },

    handleNewEmployeeError(err, file, fileList) {
      this.handleUploadError(err, file, '新员工入职表', 'newEmployee');
    },

    cancelNewEmployeeUpload() {
      this.newEmployeeUploading = false;
      this.newEmployeeUploadProgress = 0;
      this.newEmployeeUploadMessage = '上传已取消';
      this.$message.info('新员工入职表上传已取消');
    },

    downloadNewEmployeeTemplate() {
      this.downloadTemplate('新员工入职表模板.csv', 'newEmployee');
    },

    // ==================== 调令上传方法 ====================
    handleTransferBeforeUpload(file) {
      return this.handleUploadBefore(file, '.pdf', '调令');
    },

    handleTransferProgress(event, file, fileList) {
      this.handleUploadProgress(event, 'transfer');
    },

    handleTransferSuccess(response, file, fileList) {
      this.handleUploadSuccess(response, file, '调令', 'transfer');
    },

    handleTransferError(err, file, fileList) {
      this.handleUploadError(err, file, '调令', 'transfer');
    },

    cancelTransferUpload() {
      this.transferUploading = false;
      this.transferUploadProgress = 0;
      this.transferUploadMessage = '上传已取消';
      this.$message.info('调令上传已取消');
    },

    downloadTransferTemplate() {
      // 创建示例PDF的提示
      this.$message.info('请使用标准的PDF格式调令文件');
    },

    // ==================== 通用上传方法 ====================
    handleUploadBefore(file, acceptTypes, typeName) {
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      const acceptPattern = new RegExp(acceptTypes.replace(/\./g, '\\.').replace(/,/g, '|').replace(/\*/g, '.*'));

      if (!acceptPattern.test(fileExt)) {
        this.showError(`只能上传 ${acceptTypes} 格式的${typeName}文件！`);
        return false;
      }

      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isLt20M) {
        this.showError(`${typeName}文件大小不能超过 20MB！`);
        return false;
      }

      // 设置时间戳
      if (typeName === '员工花名册') {
        this.rosterUploadData.timestamp = Date.now();
        this.rosterUploading = true;
        this.rosterUploadProgress = 0;
        this.rosterUploadStatus = '';
        this.rosterUploadMessage = '上传中... 0%';
        this.rosterUploadResult = null;
      } else if (typeName === '新员工入职表') {
        this.newEmployeeUploadData.timestamp = Date.now();
        this.newEmployeeUploading = true;
        this.newEmployeeUploadProgress = 0;
        this.newEmployeeUploadStatus = '';
        this.newEmployeeUploadMessage = '上传中... 0%';
        this.newEmployeeUploadResult = null;
      } else if (typeName === '调令') {
        this.transferUploadData.timestamp = Date.now();
        this.transferUploading = true;
        this.transferUploadProgress = 0;
        this.transferUploadStatus = '';
        this.transferUploadMessage = '上传中... 0%';
        this.transferUploadResult = null;
      }

      return true;
    },

    handleUploadProgress(event, type) {
      if (event.total > 0) {
        const progress = Math.round((event.loaded / event.total) * 100);
        const message = `上传中... ${progress}%`;

        if (type === 'roster') {
          this.rosterUploadProgress = progress;
          this.rosterUploadMessage = message;
        } else if (type === 'newEmployee') {
          this.newEmployeeUploadProgress = progress;
          this.newEmployeeUploadMessage = message;
        } else if (type === 'transfer') {
          this.transferUploadProgress = progress;
          this.transferUploadMessage = message;
        }

        // 进度达到100%时立即显示遮罩层，表示开始解析
        if (progress >= 100) {
          this.isParsing = true;
        }
      }
    },

    handleUploadSuccess(response, file, typeName, type) {
      let uploading, uploadProgress, uploadStatus, uploadMessage, uploadResult;

      if (type === 'roster') {
        uploading = 'rosterUploading';
        uploadProgress = 'rosterUploadProgress';
        uploadStatus = 'rosterUploadStatus';
        uploadMessage = 'rosterUploadMessage';
        uploadResult = 'rosterUploadResult';
      } else if (type === 'newEmployee') {
        uploading = 'newEmployeeUploading';
        uploadProgress = 'newEmployeeUploadProgress';
        uploadStatus = 'newEmployeeUploadStatus';
        uploadMessage = 'newEmployeeUploadMessage';
        uploadResult = 'newEmployeeUploadResult';
      } else {
        uploading = 'transferUploading';
        uploadProgress = 'transferUploadProgress';
        uploadStatus = 'transferUploadStatus';
        uploadMessage = 'transferUploadMessage';
        uploadResult = 'transferUploadResult';
      }

      this[uploading] = false;
      this[uploadProgress] = 100;
      this[uploadStatus] = 'success';
      this[uploadMessage] = '上传成功！';

      if (response && response.success) {
        this[uploadResult] = {
          title: `${typeName}上传成功`,
          type: 'success',
          description: response.message || `${typeName}已成功上传到服务器`,
          data: response.data
        };

        // 延迟1.5秒后显示成功通知并隐藏遮罩层
        setTimeout(() => {
          this.isParsing = false;
          this.$notify({
            title: `${typeName}上传成功`,
            message: response.message || `${typeName}已成功上传到服务器`,
            type: 'success',
            duration: 5000
          });
        }, 1500);

        // 保存到历史记录
        this.saveToHistory(file.name, true, response.data, typeName);

        // 如果是员工花名册上传成功，自动重新加载数据
        if (type === 'roster') {
          this.loadAllEmployeeData();
        }
      } else {
        this[uploadStatus] = 'exception';
        this.showError(response?.message || '服务器处理失败');
      }
    },

    handleUploadError(err, file, typeName, type) {
      let uploading, uploadProgress, uploadStatus, uploadMessage;

      if (type === 'roster') {
        uploading = 'rosterUploading';
        uploadProgress = 'rosterUploadProgress';
        uploadStatus = 'rosterUploadStatus';
        uploadMessage = 'rosterUploadMessage';
      } else if (type === 'newEmployee') {
        uploading = 'newEmployeeUploading';
        uploadProgress = 'newEmployeeUploadProgress';
        uploadStatus = 'newEmployeeUploadStatus';
        uploadMessage = 'newEmployeeUploadMessage';
      } else {
        uploading = 'transferUploading';
        uploadProgress = 'transferUploadProgress';
        uploadStatus = 'transferUploadStatus';
        uploadMessage = 'transferUploadMessage';
      }

      this[uploading] = false;
      this[uploadProgress] = 0;
      this[uploadStatus] = 'exception';
      this[uploadMessage] = '上传失败';

      let errorMsg = `${typeName}上传失败`;

      if (err.message) {
        errorMsg += ': ' + err.message;
      } else if (err.status === 413) {
        errorMsg = `${typeName}文件太大，请压缩文件后重试`;
      } else if (err.status === 415) {
        errorMsg = `${typeName}文件格式不支持`;
      } else if (err.status === 500) {
        errorMsg = '服务器内部错误，请稍后重试';
      } else if (err.status === 0) {
        errorMsg = '网络连接失败，请检查网络';
      }

      this.showError(errorMsg);

      // 隐藏遮罩层
      this.isParsing = false;

      // 保存到历史记录
      this.saveToHistory(file.name, false, null, errorMsg, typeName);
    },

    // 显示错误
    showError(message) {
      this.errorMessage = message;
      this.errorDialogVisible = true;

      this.$notify.error({
        title: '错误',
        message: typeof message === 'string' ? message : '上传失败',
        duration: 5000
      });
    },

    // 重试上传
    retryUpload() {
      this.errorDialogVisible = false;
      this.$message.info('请重新选择文件上传');
    },

    // 下载模板
    downloadTemplate(filename, type) {
      let templateData;

      if (type === 'roster') {
        templateData = [
          [
            'personnel_code', 'name', 'name_pinyin', 'department_attribute', 'department', 'office',
            'administrative_position', 'administrative_level', 'technical_position', 'position_for_certificate',
            'position_title_chinese', 'position_title_english', 'actual_position', 'sequence', 'rank_level',
            'professional_title_level', 'technical_title', 'general_administrative_level', 'skill_level',
            'assessment_date', 'personnel_category', 'recruitment_source', 'highest_education', 'employment_date',
            'work_years', 'company_years', 'gender', 'ethnicity', 'birth_date', 'age', 'work_start_date',
            'political_status', 'political_status_date', 'id_card', 'native_place', 'graduation_date',
            'education_type', 'school', 'major', 'rotation_dispatch', 'internal_email', 'comac_external_email',
            'non_comac_external_email', 'mobile_phone', 'is_shanghai_resident', 'is_archive_in_company',
            'management_talent', 'professional_technical_talent', 'skilled_talent', 'remarks'
          ],
          [
            'EMP001', '张三', 'Zhang San', '总部', '技术部', '开发科',
            '部门经理', 'M4', '高级工程师', '前端开发工程师',
            '前端开发工程师', 'Frontend Developer', '前端开发', '技术序列', 'P7',
            '高级', '高级工程师', 'M4', '四级', '2023-01-15',
            '正式员工', '校园招聘', '本科', '2022-03-15',
            '3', '2', '男', '汉族', '1995-05-20', '28', '2019-07-01',
            '中共党员', '2018-06-01', '320101199505201234', '江苏南京', '2017-06-30',
            '全日制', '南京大学', '计算机科学与技术', '无',
            'zhangsan@company.com', 'zhangsan@comac.com', 'zhangsan@gmail.com', '13800138000',
            '是', '是', '是', '是', '是', '工作认真负责'
          ]
        ];
      } else if (type === 'newEmployee') {
        templateData = [
          [
            '姓名', '性别', '出生日期', '身份证号', '联系电话', '邮箱',
            '毕业院校', '专业', '学历', '入职部门', '岗位', '入职日期'
          ],
          [
            '李四', '女', '1998-08-15', '320101199808151234', '13900139000', 'lisi@company.com',
            '清华大学', '计算机科学', '硕士', '技术部', '后端开发', '2023-10-01'
          ]
        ];
      }

      // 创建 CSV 内容
      const csvContent = templateData.map(row =>
        row.map(cell => `"${cell}"`).join(',')
      ).join('\n');

      // 创建 Blob 并下载
      const blob = new Blob(['\ufeff' + csvContent], {
        type: 'text/csv;charset=utf-8;'
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();

      this.$message.success('模板下载成功，请填写数据后上传');
    },

    // 保存到历史记录
    saveToHistory(filename, success, data, error, type) {
      const history = {
        id: Date.now(),
        filename: filename,
        time: new Date().toLocaleString(),
        type: type || '员工花名册',
        success: success,
        rows: data?.total_rows || 0,
        data: data
      };

      this.uploadHistory.unshift(history);

      // 只保留最近20条记录
      if (this.uploadHistory.length > 20) {
        this.uploadHistory.pop();
      }

      // 保存到 localStorage
      localStorage.setItem('excel_upload_history', JSON.stringify(this.uploadHistory));
    },

    // 加载历史记录
    loadHistory() {
      try {
        const history = localStorage.getItem('excel_upload_history');
        if (history) {
          this.uploadHistory = JSON.parse(history);
        }
      } catch (e) {
        console.error('加载历史记录失败:', e);
        this.uploadHistory = [];
      }
    },

    // 查看详情
    viewDetails(record) {
      // 根据记录类型显示不同的结果
      if (record.type === '员工花名册') {
        this.rosterUploadResult = {
          title: `文件详情 - ${record.filename}`,
          type: 'info',
          description: `上传时间: ${record.time}`,
          data: record.data
        };
      } else if (record.type === '新员工入职表') {
        this.newEmployeeUploadResult = {
          title: `文件详情 - ${record.filename}`,
          type: 'info',
          description: `上传时间: ${record.time}`,
          data: record.data
        };
      } else if (record.type === '调令') {
        this.transferUploadResult = {
          title: `文件详情 - ${record.filename}`,
          type: 'info',
          description: `上传时间: ${record.time}`,
          data: record.data
        };
      }
    },

    // ==================== 前端分页相关方法 ====================

    // 加载所有员工数据
    async loadAllEmployeeData() {
      this.tableLoading = true;
      try {
        // 构建完整的API地址
        const apiUrl = this.$store.state.icd.baseURL + "/api/employee.php";

        // 不传递分页参数，获取所有数据
        const response = await axios.get(apiUrl);

        if (response.data && response.data.success) {
          this.allEmployeeData = response.data.data || [];
          console.log(this.allEmployeeData)

          // 提取部门选项
          this.extractDepartmentOptions();

          this.$message.success(`已加载 ${this.allEmployeeData.length} 条记录`);
        } else {
          this.$message.error(response.data?.message || '获取数据失败');
        }
      } catch (error) {
        console.error('获取数据失败:', error);
        this.$message.error('网络请求失败: ' + (error.message || '未知错误'));
      } finally {
        this.tableLoading = false;
      }
    },

    // 提取部门选项
    extractDepartmentOptions() {
      const departments = new Set();
      this.allEmployeeData.forEach(item => {
        if (item.department) {
          departments.add(item.department);
        }
      });

      // 从localStorage加载自定义部门
      try {
        const customDepts = localStorage.getItem('custom_departments');
        if (customDepts) {
          JSON.parse(customDepts).forEach(dept => departments.add(dept));
        }
      } catch (e) {
        console.error('加载自定义部门失败:', e);
      }

      this.departmentOptions = Array.from(departments).sort();
    },

    // 获取选择器选项
    getSelectOptions(field) {
      if (field === 'gender') {
        return ['男', '女'];
      } else if (field === 'highest_education') {
        return ['博士', '硕士', '本科', '大专', '高中', '其他'];
      } else if (field === 'personnel_category') {
        return ['正式员工', '合同工', '实习生', '临时工', '其他'];
      } else if (field === 'department') {
        return this.departmentOptions;
      } else {
        return [];
      }
    },

    // 格式化单元格值
    formatCellValue(value) {
      if (value === null || value === undefined || value === '') {
        return '-';
      }
      return String(value);
    },

    // 处理搜索
    handleSearch() {
      // 清除之前的计时器
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }

      // 设置新的计时器，实现防抖
      this.searchTimer = setTimeout(() => {
        this.currentPage = 1;
      }, 300);
    },

    // 处理筛选
    handleFilter() {
      this.currentPage = 1;
    },

    // 分页大小改变
    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
    },

    // 当前页改变
    handleCurrentChange(page) {
      this.currentPage = page;
      // 滚动到表格顶部
      this.$nextTick(() => {
        const tableEl = document.querySelector('.editable-table-container');
        if (tableEl) {
          tableEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    },

    // 加载列配置
    loadColumnConfig() {
      try {
        const savedConfig = localStorage.getItem('employee_columns_config');
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig);
          // 合并配置
          this.columns.forEach((col, index) => {
            if (parsedConfig[col.key]) {
              this.columns[index] = { ...col, ...parsedConfig[col.key] };
            }
          });
        }
      } catch (e) {
        console.error('加载列配置失败:', e);
      }
    },

    // 保存列配置
    saveColumnConfig() {
      try {
        const config = {};
        this.columns.forEach(col => {
          config[col.key] = {
            visible: col.visible,
            minWidth: col.minWidth,
            fixed: col.fixed
          };
        });
        localStorage.setItem('employee_columns_config', JSON.stringify(config));
        this.columnDialogVisible = false;
        this.$message.success('列配置已保存');
      } catch (e) {
        console.error('保存列配置失败:', e);
        this.$message.error('保存列配置失败');
      }
    },

    // 恢复默认列配置
    resetColumnConfig() {
      this.columns.forEach(col => {
        if (col.key === 'id') {
          col.visible = false;
        } else if (col.key === 'personnel_code' || col.key === 'name') {
          col.visible = true;
          col.fixed = true;
        } else if (col.key === 'name_pinyin') {
          col.visible = false;
        } else if (col.group === '统计字段' || col.group === '异动信息字段' || col.key === 'updated_at') {
          col.visible = false;
        } else {
          col.visible = true;
        }
      });
    },

    // 更新全选状态
    updateSelectAllStatus() {
      const visibleColumns = this.columns.filter(col => col.key !== 'id');
      const checkedCount = visibleColumns.filter(col => col.visible).length;
      const totalColumns = visibleColumns.length;

      this.selectAllColumns = checkedCount === totalColumns && totalColumns > 0;
      this.isIndeterminate = checkedCount > 0 && checkedCount < totalColumns;
    },

    // 处理全选/全不选
    handleSelectAllColumns(val) {
      this.columns.forEach(col => {
        if (col.key !== 'id') {
          col.visible = val;
        }
      });
    },

    // 处理列变更
    handleColumnChange() {
      this.updateSelectAllStatus();
    },

    // 获取表单组件
    getFormComponent(column) {
      if (column.type === 'date') {
        return 'el-date-picker';
      } else if (column.type === 'select') {
        return 'el-select';
      } else if (column.type === 'number') {
        return 'el-input-number';
      } else if (column.type === 'textarea') {
        return 'el-input';
      } else if (column.type === 'switch') {
        return 'el-switch';
      } else {
        return 'el-input';
      }
    },

    // 添加员工
    handleAdd() {
      this.dialogTitle = '添加员工';
      this.formData = {};
      this.activeTab = 'basic';
      this.dialogVisible = true;
    },

    // 编辑员工
    handleEdit(row) {
      // 设置编辑状态
      this.$set(row, 'editing', true);
      // 保存原始数据
      this.editingRowOriginal = { ...row };
    },

    // 保存编辑
    async handleSave(row) {
      try {
        // 验证必填字段
        if (!row.personnel_code || !row.name || !row.gender || !row.department) {
          this.$message.error('请填写必填字段');
          return;
        }

        // 构建完整的API地址
        const apiUrl = this.$store.state.icd.baseURL + "/api/employee.php";

        const response = await axios.post(apiUrl, row);

        if (response.data && response.data.success) {
          this.$message.success('保存成功');
          // 取消编辑状态
          this.$set(row, 'editing', false);
          // 重新加载数据
          this.loadAllEmployeeData();
        } else {
          this.$message.error(response.data?.message || '保存失败');
        }
      } catch (error) {
        console.error('保存失败:', error);
        this.$message.error('保存失败: ' + (error.message || '未知错误'));
      }
    },
    // 取消编辑
    cancelEdit(row) {
      // 恢复原始数据
      if (this.editingRowOriginal) {
        Object.keys(this.editingRowOriginal).forEach(key => {
          row[key] = this.editingRowOriginal[key];
        });
      }
      this.$set(row, 'editing', false);
      this.editingRowOriginal = null;
    },

    // 删除员工
    async handleDelete(row) {
      try {
        await this.$confirm('确定要删除该员工吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });

        // 构建完整的API地址
        const apiUrl = this.$store.state.icd.baseURL + "/api/employee.php";

        const response = await axios.post(apiUrl, { id: row.id });

        if (response.data && response.data.success) {
          this.$message.success('删除成功');
          this.loadAllEmployeeData();
        } else {
          this.$message.error(response.data?.message || '删除失败');
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败:', error);
          this.$message.error('删除失败: ' + (error.message || '未知错误'));
        }
      }
    },

    // 对话框关闭处理
    handleDialogClose() {
      if (this.$refs.employeeForm) {
        this.$refs.employeeForm.resetFields();
      }
    },

    // 表单提交
    async handleSubmit() {
      try {
        // 验证表单
        if (this.$refs.employeeForm) {
          await this.$refs.employeeForm.validate();
        }

        // 构建完整的API地址
        const apiUrl = this.$store.state.icd.baseURL + "/api/employee.php";

        const response = await axios.post(apiUrl, this.formData);

        if (response.data && response.data.success) {
          this.$message.success(this.dialogTitle === '添加员工' ? '添加成功' : '更新成功');
          this.dialogVisible = false;
          this.loadAllEmployeeData();
        } else {
          this.$message.error(response.data?.message || '操作失败');
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('表单提交失败:', error);
        }
      }
    },

    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '-');
    },

    // 格式化日期时间
    formatDateTime(dateTimeString) {
      if (!dateTimeString) return '';
      const date = new Date(dateTimeString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\//g, '-');
    },

    // 格式化文件大小
    formatFileSize(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  }
};
</script>

<style scoped>
.excel-upload {
  padding: 20px;
  max-width: 100%;
  margin: 0 auto;
  overflow-x: hidden;
}

/* 上传行样式 */
.upload-row {
  margin-bottom: 20px;
}

.upload-card {
  height: 100%;
}

/* 上传区域样式 */
.upload-demo {
  margin-bottom: 0;
}

::v-deep .el-upload {
  width: 100%;
}

::v-deep .el-upload .el-upload-dragger {
  height: 100%;
  width: 100%;
  padding: 0px;
  border: 0px;
}

.default-upload-area {
  text-align: center;
  padding: 0px 0;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.default-upload-area i {
  font-size: 50px;
  color: #c0c4cc;
  margin-top: 0px;
  margin-bottom: 15px;
  display: block;
}

.default-upload-area .el-upload__text {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
  line-height: 1.4;
}

.default-upload-area .el-upload__text em {
  color: #409EFF;
  font-style: normal;
}

.default-upload-area .el-upload__tip {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
  max-width: 80%;
  margin: 0 auto;
}

/* 上传中区域 */
.uploading-area {
  text-align: center;
  padding: 0px 0;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.uploading-area i {
  font-size: 50px;
  color: #c0c4cc;
  margin-top: 0px;
  margin-bottom: 15px;
  display: block;
  transition: color 0.3s;
}

.uploading-area i.success-icon {
  color: #67c23a;
}

.uploading-area i.error-icon {
  color: #f56c6c;
}

.uploading-area .el-upload__text {
  font-size: 16px;
  color: #606266;
  margin-bottom: 15px;
  font-weight: 500;
}

.upload-progress-container {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.progress-percentage {
  font-size: 14px;
  color: #409EFF;
  font-weight: 500;
}

.cancel-btn {
  padding: 0;
  font-size: 12px;
  color: #909399;
}

.cancel-btn:hover {
  color: #f56c6c;
}

.progress-message {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
  text-align: center;
  min-height: 16px;
}

/* 上传结果区域 */
.result-area {
  margin-top: 15px;
  padding: 15px;
  background: #f0f9eb;
  border-radius: 4px;
  border: 1px solid #e1f3d8;
}

/* 表格相关样式 */
.data-table-card {
  margin-top: 20px;
  overflow: visible;
}

.table-toolbar {
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
}

/* 表格容器 */
.editable-table-container {
  margin-bottom: 20px;
  overflow-x: hidden;
  /* 移除横向滚动条 */
  width: 100%;
}

.editable-table-container .el-table {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  width: 100% !important;
  table-layout: auto;
  /* 让表格自动调整列宽 */
}

.pagination-container {
  text-align: center;
  padding: 20px 0;
  background: #f5f7fa;
  border-radius: 4px;
}

/* 列配置对话框 */
.column-config-dialog {
  max-height: 500px;
  overflow-y: auto;
}

.column-group {
  margin-bottom: 20px;
}

.column-group h4 {
  margin: 10px 0;
  padding-bottom: 5px;
  border-bottom: 1px solid #ebeef5;
  color: #409EFF;
}

.column-config-grid {
  margin-top: 10px;
}

.column-config-grid .el-col {
  margin-bottom: 10px;
}

/* 表单样式 */
.employee-form {
  max-height: 500px;
  overflow-y: auto;
}

.email-link {
  color: #409EFF;
  text-decoration: none;
}

.email-link:hover {
  text-decoration: underline;
}

/* 编辑行样式 */
:deep(.editing-row) {
  background-color: #f0f9eb !important;
}

:deep(.editing-row:hover > td) {
  background-color: #e1f3d8 !important;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .excel-upload {
    padding: 10px;
  }

  .upload-row .el-col {
    margin-bottom: 20px;
  }
}

/* 遮罩层样式 */
.parsing-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.parsing-content {
  background: white;
  padding: 40px 60px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.parsing-content i {
  font-size: 48px;
  color: #409EFF;
  margin-bottom: 20px;
  display: block;
}

.parsing-content p {
  font-size: 18px;
  color: #333;
  margin: 0;
  font-weight: 500;
}
</style>