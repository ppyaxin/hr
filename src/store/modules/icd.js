const state = {
   
    baseURL:"http://localhost/hr",

    allmsId:[],
    DPGUID:"",
    RPGUID:"",
    parameterList:[],
    choosedICDPath:"",
    cplATA:"",
    cplSavePath:"",
    parameterPurposes:[],
    // baseURL:"http://10.11.53.158:8080/hr"
  }
  
  const mutations = {
    SET_PARAMETER_PURPOSES:(state,parameterPurposes)=>{
       state.parameterPurposes = parameterPurposes
    },
    SET_CPL_ATA:(state,cplATA)=>{
       state.cplATA = cplATA
    },
    SET_CPL_SAVE_PATH:(state,cplSavePath)=>{
      state.cplSavePath = cplSavePath
    },
    SET_CHOOSED_ICD_PATH:(state,choosedICDPath)=>{
      state.choosedICDPath = choosedICDPath
    },
    SET_PARAMETER_LIST:(state,parameterList)=>{
       state.parameterList = parameterList
    },
    SET_ALL_MSID:(state,allmsId)=>{
       state.allmsId = allmsId
    },
    SET_DPGUID:(state,DPGUID)=>{
      state.DPGUID =DPGUID
    },
    SET_RPGUID:(state,RPGUID)=>{
      state.RPGUID =RPGUID
    }
  }
  
  const actions = {
    setParameterPurposes({commit},parameterPurposes){
      commit('SET_PARAMETER_PURPOSES',parameterPurposes)
    },
    setCPLATA({commit},cplATA){
      commit('SET_CPL_ATA',cplATA)
    },
    setCplSavePath({commit},cplSavePath){
       commit('SET_CPL_SAVE_PATH',cplSavePath)
    },
    setChoosedICDPath({commit},choosedICDPath){
      commit('SET_CHOOSED_ICD_PATH',choosedICDPath)
    },
    setParameterList({commit},parameterList){
       commit('SET_PARAMETER_LIST',parameterList)
    },
    setAllMSID({commit},allmsId){
      commit('SET_ALL_MSID',allmsId)
    },
    setDPGUID({commit},DPGUID){
      commit('SET_DPGUID',DPGUID)
    },
    setRPGUID({commit},RPGUID){
      commit('SET_RPGUID',RPGUID)
    }

  }
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  