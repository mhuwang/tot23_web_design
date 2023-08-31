<template>
  <div>
    <el-card class="box-card">
      <!-- <div slot="header" class="clearfix">
        <span>创建资源</span>
      </div> -->
      <el-tabs tab-position="top" style="margin-bottom: 170px">
        <!-- 从表单创建 -->
        <el-tab-pane>
          <span slot="label"><i class="el-icon-document" />从表单创建</span>
          <!-- 必填信息 -->
          <el-form
            ref="baseInformation"
            :model="baseInformation"
            :rules="baseInformationRules"
            :label-position="'top'"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="容器组 名称" prop="name" required>
              <el-input v-model="baseInformation.name" />
            </el-form-item>
            <el-form-item label="容器组 命名空间" prop="namespace" required>
              <el-select
                v-model="baseInformation.namespace"
                filterable
                size="large"
                style="width: 100%"
                placeholder="请选择命名空间"
                @change='whenNamespaceChange'
                @focus="initNamespaces"
              >
                <el-option
                  v-for="item in namespaces"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form/>
            <el-form
              :inline="true"
              :label-position="'top'"
              :model="baseInformation"
              :rules="baseInformationRules"
            >
              <el-form-item label="容器镜像" prop="image" required>
                <el-input v-model="baseInformation.image" />
              </el-form-item>
              <el-form-item
                label="镜像下载策略"
                prop="imagePullPolicy"
                required
              >
                <el-select
                  v-model="baseInformation.imagePullPolicy"
                  placeholder="请选策略"
                >
                  <el-option label="总是下载" value="Always" />
                  <el-option label="不存在时" value="IfNotPresent" />
                  <el-option label="从不下载" value="Never" />
                </el-select>
              </el-form-item>
            </el-form>

            <el-form-item label="容器组 数量" required>
              <el-input-number
                v-model="baseInformation.number"
                :min="1"
                :max="100000"
                label="容器组 数量"
                controls-position="right"
              />
            </el-form-item>
            <el-form-item label="服务" prop="service" required>
              <el-select
                v-model="baseInformation.service"
                placeholder="请选服务"
                @change="serviceChange"
              >
                <el-option label="无服务" value="None" />
                <el-option label="内部服务" value="Internal" />
                <el-option label="外部服务" value="External" />
              </el-select>
            </el-form-item>
            <List
              v-for="count in baseInformation.serviceCount"
              :key="count"
              item-layout="horizontal"
              :split="false"
            >
              <el-form :inline="true" class="demo-form-inline">
                <el-form-item
                  v-if="
                    baseInformation.service == 'Internal' ||
                      baseInformation.service == 'External'
                  "
                >
                  <div class="service-item">
                    <p>端口{{ count }}</p>
                    <el-input-number
                      v-model="baseInformation.ports[count - 1]"
                      :min="1"
                      :max="65535"
                      label="端口"
                      controls-position="right"
                      @change="serviceDetailedChange"
                    />
                  </div>
                  <div class="service-item">
                    <p>目的端口{{ count }}</p>
                    <el-input-number
                      v-model="baseInformation.targetPorts[count - 1]"
                      :min="1"
                      :max="65535"
                      label="目的端口"
                      controls-position="right"
                      @change="serviceDetailedChange"
                    />
                  </div>
                  <div class="service-item">
                    <p>协议</p>
                    <el-select
                      v-model="baseInformation.protocols[count - 1]"
                      placeholder="请选协议"
                      @change="serviceDetailedChange"
                    >
                      <el-option label="UDP" value="UDP" />
                      <el-option label="TCP" value="TCP" />
                    </el-select>
                  </div>
                </el-form-item>
              </el-form>
            </List>
            <el-form-item v-if="!completeOption">
              <el-button type="primary" @click="submitPod()">创 建</el-button>
              <el-button @click="resetPodInformation()">重 置</el-button>
              <el-button
                type="text"
                @click="showCompleteOption(completeOption)"
              >显示高级选项</el-button>
            </el-form-item>
          </el-form>
          <!-- 高级信息 -->
          <el-form
            v-if="completeOption"
            ref="seniorInformation"
            :model="seniorInformation"
            :rules="seniorInformationRules"
            label-widsth="100px"
            class="demo-ruleForm"
            :label-position="'top'"
          >
            <el-form-item label="描述" prop="annotations">
              <el-input
                v-model="seniorInformation.annotations"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="请输入内容"
              />
            </el-form-item>
            <el-form-item label="标签" prop="labels">
              <List
                item-layout="horizontal"
                :split="false"
              >
                <el-form-item
                  v-for="count in seniorInformation.labelsCount"
                  :key="count"
                  prop="labelsKeys[count - 1]"
                >
                  <div class="label-item">
                    <el-input
                      v-model="seniorInformation.labels.labelsKeys[count - 1]"
                      size="medium"
                      placeholder="键"
                      suffix-icon="el-icon-key"
                      @change="labelDetailedChange"
                    />
                  </div>
                  <div class="label-item">
                    <el-input
                      v-model="seniorInformation.labels.labelsValues[count - 1]"
                      size="medium"
                      placeholder="值"
                      suffix-icon="el-icon-thumb"
                      @change="labelDetailedChange"
                    />
                  </div>
                </el-form-item>
              </List>
            </el-form-item>
            <el-form :inline="true" :label-position="'top'">
              <el-form-item label="CPU最低需求">
                <el-input-number
                  v-model="seniorInformation.cpuRequire"
                  :min="0"
                  label="CPU最低需求"
                  controls-position="right"
                />
              </el-form-item>
              <el-form-item label="CPU最高限制">
                <el-input-number
                  v-model="seniorInformation.cpuLimit"
                  :min="0"
                  label="CPU最高限制"
                  controls-position="right"
                />
              </el-form-item>
              <el-form-item label="单位">
                <el-select
                  v-model="seniorInformation.cpuUnit"
                  placeholder="请选单位"
                >
                  <el-option label="核" value="M" />
                  <el-option label="m" value="m" />
                </el-select>
              </el-form-item>
            </el-form>
            <el-form :inline="true" :label-position="'top'">
              <el-form-item label="Memory最低需求">
                <el-input-number
                  v-model="seniorInformation.memoryRequire"
                  :min="0"
                  label="Memory最低需求"
                  controls-position="right"
                />
              </el-form-item>
              <el-form-item label="Memory最高限制">
                <el-input-number
                  v-model="seniorInformation.memoryLimit"
                  :min="0"
                  label="Memory最高限制"
                  controls-position="right"
                />
              </el-form-item>
              <el-form-item label="单位">
                <el-select
                  v-model="seniorInformation.memoryUnit"
                  placeholder="请选单位"
                >
                  <el-option label="Gi" value="Gi" />
                  <el-option label="Mi" value="Mi" />
                </el-select>
              </el-form-item>
            </el-form>
            <el-form-item label="镜像拉取密钥" prop="secret">
              <el-select
                v-model="seniorInformation.secret"
                v-loading="secretLoading"
                filterable
                size="large"
                style="width: 100%"
                placeholder="请选密钥"
                @focus="showSecretsInNamespace"
                @visible-change="selectVisibleChange"
              >
                <el-option
                  v-for="secret in secretsNameInNamespace"
                  :key="secret"
                  :label="secret"
                  :value="secret"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="运行命令" prop="commands">
              <el-input
                v-model="seniorInformation.command"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="请输入内容"
              />
            </el-form-item>
            <el-form-item label="命令参数" prop="args">
              <el-input
                v-model="seniorInformation.args"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="请输入内容"
              />
            </el-form-item>
            <el-form-item label="环境变量" prop="env">
              <List
                v-for="count in seniorInformation.envCount"
                :key="count"
                item-layout="horizontal"
                :split="false"
              >
                <el-form-item>
                  <div class="label-item">
                    <el-input
                      v-model="seniorInformation.env.envKeys[count - 1]"
                      size="medium"
                      placeholder="键"
                      suffix-icon="el-icon-key"
                      @change="envDetailedChange"
                    />
                  </div>
                  <div class="label-item">
                    <el-input
                      v-model="seniorInformation.env.envValues[count - 1]"
                      size="medium"
                      placeholder="值"
                      suffix-icon="el-icon-thumb"
                      @change="envDetailedChange"
                    />
                  </div>
                </el-form-item>
              </List>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitPod">创 建</el-button>
              <el-button @click="resetPodInformation()">重 置</el-button>
              <el-button
                round="true"
                type="text"
                @click="showCompleteOption(completeOption)"
              >收起高级选项</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 输入并创建 -->
        <el-tab-pane>
          <span
            slot="label"
          ><i class="el-icon-document-add" />输入并创建</span>
          <codemirror
            ref="cmYamlAdd"
            :value="addYaml"
            :options="cmOptionsYaml"
            @ready="onAddYamlCmReady"
            @input="onAddYamlCmCodeChange"
          />
          <span class="dialog-footer">
            <!-- <div class="foot-info">
                <i class="el-icon-warning"></i> 此操作相当于 kubectl apply -f
                &ltspec.yaml>
              </div> -->
            <br>
            <el-button type="primary" @click="commitPodAdd">创 建</el-button>
            <el-button @click="addDialogVisible = false">取 消</el-button>
          </span>
        </el-tab-pane>

        <!-- 从文件创建 -->
        <el-tab-pane>
          <span slot="label"><i class="el-icon-folder" />从文件创建</span>

          <!-- <el-upload
            style="display: inline-block"
            :limit="uploadFileLimit"
            class="upload-demo"
            ref="upload"
            :action="uploadUrl"
            :file-list="fileList"
            :http-request="uploadSectionFile"
            :auto-upload="true"
            :before-remove="handleRemove"
          >
            <el-button slot="trigger" size="small" type="primary" plain
              >选取文件</el-button
            >
            <el-button
              style="margin-left: 10px"
              size="small"
              icon="el-icon-upload2"
              type="success"
              @click="submitUpload"
              >导入</el-button
            >
          </el-upload> -->

          <el-upload
            class="upload-demo"
            drag
            action
            multiple
            :show-file-list="true"
            :auto-upload="true"
            :limit="uploadFileLimit"
            :name="fileName"
            :file-list="fileList"
            :http-request="uploadSectionFile"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div slot="tip" class="el-upload__tip">
              只能上传Yaml格式的文件，且不超过500kb
            </div>
          </el-upload>
          <br>
          <!-- <el-button
              style="margin-left: 10px"
              icon="el-icon-upload2"
              type="primary"
              @click="uploadSectionFile"
              >导入</el-button
            > -->
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
// import language js
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/yaml/yaml.js'
// import theme style
import 'codemirror/theme/panda-syntax.css'
// eslint-disable-next-line no-unused-vars
import request from '@/utils/request'

export default {
  data() {
    /** 基础性项验证*/
    // 名称
    const validateName = (rule, value, callback) => {
      const legalName = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/
      const illegalName = /[^0-9a-z\.-]/g
      if (value === '') {
        callback(new Error('请输入容器组名称，允许输入数字，小写字母，-和.'))
      } else if (illegalName.test(value)) {
        // callback(new Error('请输入数字，小写字母，-和.'))
        this.baseInformation.name = this.baseInformation.name.replace(/[^0-9a-z\.-]/g, '')
      } else if (value.length > 63) {
        callback(new Error('长度不能超过63位'))
      } else if (!legalName.test(value)) {
        callback(new Error('格式有误，允许输入数字，小写字母，-和.'))
      }
    }
    // 镜像
    const validateImage = (rule, value, callback) => {
      const illegalName = /[^\x00-\xff]/
      if (value === '') {
        callback(new Error('请输入镜像名称及版本号'))
      } else if (illegalName.test(value)) {
        callback(new Error('请勿输入中文字符'))
      } else if (/[ ]/.test(value)) {
        callback(new Error('请勿输入空格'))
      }
    }
    /** 高级选项验证*/
    // 描述
    const validateAnnotations = (rule, value, callback) => {
      const legalKey = /^ *([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9] *:[ ]*[^ ].*$/
      const illegalSpace = /^[ ]*[^ |:]+( )+[^ |:]+[^:]*:/
      const enter = /^[ ]*$/
      const annotations = value.split('\n')
      for (let i = 0; i < annotations.length; i += 1) {
        console.log(annotations[i].search(/[^ ]/), annotations[i].search(/\b[ |:]/))
        console.log('+++', annotations[i].slice(annotations[i].indexOf(' '), annotations[i].indexOf(/\b./)))
        // console.log(annotations[i])
        if (enter.test(annotations[i])) {
          continue
        } else if (illegalSpace.test(annotations[i])) {
          callback(new Error('请勿在键中输入空格'))
        } else if (!legalKey.test(annotations[i])) {
          callback(new Error('格式有误，允许输入数字，英文字母，下划线，-，.，请勿在键中输入空格'))
        } else if (annotations[i].slice(annotations[i].search(/[^ ]/), annotations[i].search(/\b[ |:]/)).length > 63) {
          callback(new Error('键的长度不能超过63'))
        }
      }
    }
    // labelsKey
    const validateLabelsKey = (rule, value, callback) => {
      const legalKey = /^([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]$/
      // const legalValue //
      if (value.length > 63) {
        callback(new Error('长度不能超过63位'))
      } else if (!legalKey.test(value)) {
        callback(new Error('格式有误，允许输入数字，英文字母，下划线，-和.'))
      }
    }
    // labelsValue
    const validateLabelsValue = (rule, value, callback) => {
      const legalValue = /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/
      // const legalValue //
      if (value.length > 63) {
        callback(new Error('长度不能超过63位'))
      } else if (!legalValue.test(value)) {
        callback(new Error('格式有误，允许输入数字，英文字母，下划线，-和.'))
      }
    }

    return {
      /** 页面数据 */
      namespaces: [], // 命名空间
      secretsName: {}, // Secrets 的名字 按命名空间分类
      secretsNameInNamespace: [], // 在某一命名空间下的 Secrets 名字

      /** 编辑框部分 */
      addDialogVisible: true, // 添加框详情
      addYaml: '', // 输入框的 yaml 数据
      cmOptionsYaml: {
        // yaml codemirror 配置项
        tabSize: 4,
        mode: 'yaml',
        theme: 'panda-syntax',
        lineNumbers: true,
        line: true
      },

      /** 表单部分 */
      // 基本选项
      baseInformation: {
        name: '',
        namespace: 'default',
        image: '',
        imagePullPolicy: 'Always',
        number: 1,
        service: 'None',
        serviceCount: 0,
        ports: [1],
        targetPorts: [1],
        protocols: ['TCP']
      },
      // 高级选项
      seniorInformation: {
        annotations: '',
        labels: {
          labelsKeys: [''],
          labelsValues: ['']
        },
        labelsCount: 1,
        secret: '',
        cpuRequire: 0,
        cpuLimit: 0,
        cpuUnit: 'M',
        memoryRequire: 0,
        memoryLimit: 0,
        memoryUnit: 'Mi',
        commands: '',
        args: '',
        env: {
          envKeys: [''],
          envValues: ['']
        },
        envCount: 1
      },
      completeOption: false, // 是否显示高级选项
      secretLoading: false,
      // 基础选项验证
      baseInformationRules: {
        name: [
          { validator: validateName, trigger: 'blur' }
        ],
        image: [
          { validator: validateImage, trigger: 'blur' }
        ]
      },

      // 高级选项验证
      seniorInformationRules: {
        annotations: [
          { validator: validateAnnotations, trigger: 'blur' }
        ],
        labels: [{
          type: 'Object',
          trigger: 'change',
          fields: {
            labelsKeys: {
              0: { validator: validateLabelsKey, trigger: 'blur' }
            },
            labelsValues: {
              0: { validator: validateLabelsValue, trigger: 'blur' }
            }
          }
        }]
      },

      /** 上传文件部分 */
      uploadFileLimit: 5,
      fileList: [],
      fileName: 'pod.yaml'
    }
  },

  created() {
    this.getAllSecretsName()
  },

  methods: {
    /** 表单部分开始*/
    /** 命名空间框的事件 */
    // 当选择框聚焦时获取命名空间
    initNamespaces() {
      if (this.namespaces.length === 0) {
        this.namespaces = this.$store.state.namespaces.namespaces
        this.namespaces = this.namespaces.slice(1, this.namespaces.length)
      }
    },
    // 命名空间变化时
    whenNamespaceChange() {
      this.seniorInformation.secret = ''
    },

    /** Pod 的选择服务框部分 */
    // Pod 的服务监控
    serviceChange() {
      this.baseInformation.serviceCount = 1
      this.baseInformation.ports = []
      this.baseInformation.targetPorts = []
      this.baseInformation.protocols = []
    },
    // Pod 的服务数量监控
    serviceDetailedChange() {
      // console.log(this.baseInformation.ports, this.baseInformation.targetPorts, this.baseInformation.protocols);
      if (
        this.baseInformation.ports[this.baseInformation.serviceCount - 1] !=
          null &&
        this.baseInformation.targetPorts[
          this.baseInformation.serviceCount - 1
        ] != null &&
        this.baseInformation.protocols[this.baseInformation.serviceCount - 1] !=
          null
      ) {
        this.addServicesList()
      }
    },
    // 增加可选服务列表
    addServicesList() {
      this.baseInformation.serviceCount = this.baseInformation.serviceCount + 1
      // this.baseInformation.ports.push(1)
      // this.baseInformation.targetPorts.push(1)
      // this.baseInformation.protocols.push('TCP')
    },

    /** label 和 env 部分 */
    // label 和 env 的数量监控
    labelDetailedChange() {
      if (
        this.seniorInformation.labels.labelsKeys[this.seniorInformation.labelsCount - 1] !==
          '' &&
        this.seniorInformation.labels.labelsValues[this.seniorInformation.labelsCount - 1] !==
          ''
      ) {
        this.addLabelsList()
      }
    },
    envDetailedChange() {
      if (
        this.seniorInformation.env.envKeys[this.seniorInformation.envCount - 1] !==
          '' &&
        this.seniorInformation.env.envValues[this.seniorInformation.envCount - 1] !==
          ''
      ) {
        this.addEnvList()
      }
    },
    // 增加 label 和 env 列表
    addLabelsList() {
      this.seniorInformation.labelsCount += 1
      this.seniorInformation.labels.labelsKeys.push('')
      this.seniorInformation.labels.labelsValues.push('')
    },
    addEnvList() {
      this.seniorInformation.envCount += 1
      this.seniorInformation.env.envKeys.push('')
      this.seniorInformation.env.envValues.push('')
    },

    /** Secret 部分 */
    // 获取全部 Secrets 名字
    getAllSecretsName() {
      this.$store
        .dispatch('secrets/getAllSecretsName', '')
        .then((res) => {
          console.log(res.data)
          this.secretsName = res.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // Secrets 选择框焦距事件
    showSecretsInNamespace() {
      // if(Object.keys(this.secretsName).length == 0) this.getAllSecretsName();
      this.secretsNameInNamespace = this.secretsName[
        this.baseInformation.namespace
      ]
      
    },

    /** 从表单创建 Pod 按钮部分 */
    // 显示高级选项
    showCompleteOption(completeOption) {
      // console.log(completeOption);
      switch (completeOption) {
        case true:
          this.completeOption = false
          // console.log(1);
          break
        case false:
          this.completeOption = true
          // console.log(2);
          break
      }
    },
    // 提交并创建Pod
    submitPod() {
      // this.$refs['ruleForm'].validate((valid) => {
      //   if (valid) {
      //     alert('submit!');
      //   } else {
      //     console.log('error submit!!');
      //     return false;
      //   }
      // });
      const podForm = new FormData()
      podForm.append('name', this.baseInformation.name)
      podForm.append('namespace', this.baseInformation.namespace)
      podForm.append('labelsKeys', this.seniorInformation.labels.labelsKeys.splice(0, this.seniorInformation.labels.labelsKeys.length - 1))
      podForm.append('labelsValues', this.seniorInformation.labels.labelsValues.splice(0, this.seniorInformation.labels.labelsValues.length - 1))
      const annotations = this.seniorInformation.annotations.split('\n')
      const annotationsKeys = []
      const annotationsValues = []
      for (const index in annotations) {
        const value = annotations[index].slice(0, annotations[index].indexOf(':'))
        const key = annotations[index].slice(annotations[index].indexOf(':') + 1)
        if (value.length > 0 && key.length > 0) {
          annotationsKeys.push(value.replace(/^ +| +$/g, ''))
          annotationsValues.push(key.replace(/^ +| +$/g, ''))
        }
      }
      podForm.append('annotationsKeys', annotationsKeys)
      podForm.append('annotationsValues', annotationsValues)
      podForm.append('image', this.baseInformation.image)
      podForm.append('imagePullPolicy', this.baseInformation.imagePullPolicy)
      podForm.append('commands', this.seniorInformation.commands.split('\n'))
      podForm.append('args', this.seniorInformation.args.split('\n'))
      podForm.append('cpuLimit', this.seniorInformation.cpuLimit.toString())
      podForm.append('cpuUnit', this.seniorInformation.cpuUnit)
      podForm.append('cpuRequest', this.seniorInformation.cpuRequire.toString())
      podForm.append('memoryLimit', this.seniorInformation.memoryLimit.toString())
      podForm.append('memoryRequest', this.seniorInformation.memoryRequire.toString())
      podForm.append('memoryUnit', this.seniorInformation.memoryUnit)
      podForm.append('envKeys', this.seniorInformation.env.envKeys.splice(0, this.seniorInformation.env.envKeys.length - 1))
      podForm.append('envValues', this.seniorInformation.env.envValues.splice(0, this.seniorInformation.env.envValues.length - 1))
      podForm.append('amount', this.baseInformation.number)
      this.$confirm('确认创建？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
          this.$store
            .dispatch('establish/createPodFromForm', podForm)
            .then((res) => {
              console.log(res)
              switch (res.code) {
                case 1200:
                  this.$message.success('创建成功')
                  // this.resetPodInformation()
                  // this.addDialogVisible = false;
                  break
                case 1201:
                  this.$message.error('创建失败')
                  this.addDialogVisible = false
                  break
                default:
                  this.$message.info('提交成功')
                  break
              }
            })
            .catch((error) => {
              console.log(error)
            })
        })
        .catch(() => {
          console.log('wrong in views/establish/submitPod')
        })
    },
    // 重置 Pod 信息
    resetPodInformation() {
      this.baseInformation = {
        name: '',
        namespace: 'default',
        image: '',
        imagePullPolicy: 'Always',
        number: 1,
        service: 'None',
        serviceCount: 0,
        ports: [1],
        targetPorts: [1],
        protocols: ['TCP']
      }
      this.seniorInformation = {
        annotations: '',
        labels: {
          labelsKeys: [''],
          labelsValues: ['']
        },
        labelsCount: 1,
        secret: '',
        cpuRequire: 0,
        cpuLimit: 0,
        cpuUnit: 'M',
        memoryRequire: 0,
        memoryLimit: 0,
        memoryUnit: 'Mi',
        commands: '',
        args: '',
        env: {
          envKeys: [''],
          envValues: ['']
        },
        envCount: 1
      }
    },
    /** 表单部分结束*/

    /** 输入部分开始*/
    /** 从输入创建 */
    // 添加的 yaml 框
    onAddYamlCmReady(cm) {
      setTimeout(() => {
        cm.refresh()
      }, 50)
    },
    onAddYamlCmCodeChange(newCode) {
      // console.log(newCode, "输入")
      this.addYaml = newCode
    },
    // 提交创建申请并返回结果
    commitPodAdd() {
      this.$confirm('创建资源？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
          console.log("addResource")
          this.$store
            .dispatch('establish/createResourceByYaml', this.addYaml)
            .then((res) => {
              console.log(res)
              switch (res.code) {
                case 1200:
                  this.$message.success('添加成功')
                  this.addDialogVisible = false
                  break
                case 1201:
                  this.$message.error('添加失败，请查看云平台相关错误信息')
                  this.addDialogVisible = false
                  break
                case 1202:
                  this.$message.error(
                    '添加失败，请查看 yaml 文件格式，命名空间必须指定'
                  )
                  break
                default:
                  this.$message.info('提交成功')
                  break
              }
            })
            .catch((error) => {
              throw error
            })
        })
        .catch(() => {
          console.log('cancel')
        })
    },
    /** 输入部分结束*/

    /** 文件部分开始*/
    /** 从文件创建 */
    uploadSectionFile(param) {
      console.log(param)
      const yamlFile = param.file
      const yamlForm = new FormData()
      yamlForm.append('yaml', yamlFile)// 文件以表单形式提交 文件名 yaml 与后台@RequestParam中参数对应
      this.$store
        .dispatch('establish/createPodFromYamlFile', yamlForm,"img")
        .then((res) => {
          console.log(res)
          switch (res.code) {
            case 1200:
              this.$message.success('创建成功')
              // this.addDialogVisible = false;
              break
            case 1201:
              this.$message.error('文件为空')
              // this.addDialogVisible = false;
              break
            case 1202:
              this.$message.error('创建失败，请查看云平台相关信息')
              // this.addDialogVisible = false;
              break
            case 1203:
              this.$message.error(
                '创建失败，命名空间必须被指定，或已有重名资源'
              )
              break
            default:
              this.$message.info('创建失败')
              break
          }
        })
        .catch(() => {})
    },
    submitUpload() {
      this.uploadSectionFile
    }
    /** 文件部分结束*/
  }
}
</script>

<style lang="scss" scoped>
// 底部命令提示信息
.foot-info {
  position: absolute;
  margin-bottom: 5px;
  padding: 5px 5px;
  background-color: #ccc;
  left: 0%;
  color: #606266;
  font-size: 15px;
}

.box-card {
  width: 100%;
  display: inline-block;
}

.service-item,
.label-item {
  display: inline-block;
  margin-right: 8px;
}
</style>
