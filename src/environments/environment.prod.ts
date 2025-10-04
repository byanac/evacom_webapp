//PRUEBAS INDRA
//const starturlDev:string = 'http://20.115.71.94:8080/SED_AEPC_BACKEND'
//const starturlHTTPS:string = 'https://20.115.71.94/api'
//PRUEBAS SEDAPAL
const starturlDev:string = 'http://104.45.195.181:8080/SED_AEPC_BACKEND'
const starturlHTTPS:string = 'https://104.45.195.181/api'

//PRUEBAS DEV
//const starturlDev:string = 'http://20.115.71.94:8083'
//const starturlHTTPS:string = 'http://20.115.71.94/api'

/*
location /api/ {
    proxy_pass http://172.190.97.40:8080/SED_AEPC_BACKEND/;
    proxy_set_header Host $host; 
    proxy_set_header X-Real-IP $remote_addr; 
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; 
    proxy_set_header X-Forwarded-Proto $scheme; 
    proxy_connect_timeout 600s; 
    proxy_read_timeout 600s;
    proxy_send_timeout 600s;
}
*/
//PRUEBAS INDRA
//const starturlSedapalSINHTTPS:string = 'http://20.115.71.94:8080/SED_AEPC_BACKEND'
////const starturlSedapal:string = 'https://srvtc1.sedapal.com.pe/SED_AEPC_BACKEND'
//const starturlSedapal:string = 'http://20.115.71.94:8080/SED_AEPC_BACKEND'

//PRUEBAS SEDAPAL
const starturlSedapalSINHTTPS:string = 'http://10.100.176.227:8080/SED_AEPC_BACKEND'
const starturlSedapal:string = 'https://srvtc1.sedapal.com.pe/SED_AEPC_BACKEND'

//PRUEBS DEV
//const starturlSedapal:string = 'http://20.115.71.94:8083'

/*
location /api/ {
    proxy_pass http://10.100.176.227:8080/SED_AEPC_BACKEND/;
    proxy_set_header Host $host; 
    proxy_set_header X-Real-IP $remote_addr; 
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; 
    proxy_set_header X-Forwarded-Proto $scheme; 
    proxy_connect_timeout 600s; 
    proxy_read_timeout 600s;
    proxy_send_timeout 600s;
}
*/

export const environment = {
    production: true,
    LoginAPI: `${starturlSedapal}/auth/login/`,
    EvalGroupAPI: `${starturlSedapal}/api/util/grupoEvaluacion/`,
    EvalsGroupsAPI: `${starturlSedapal}/api/util/gruposEvaluacion/`,
    KnowledgeQuestionsAPI: `${starturlSedapal}/api/conocimiento/`,
    CalendarAPI: `${starturlSedapal}/api/util/calendarios`,
    GerencyAPI: `${starturlSedapal}/api/util/gerencias`,
    UpdateGerencyAPI:`${starturlSedapal}/api/util/update/gerencias`, //PROY-00013
    UpdateTeamAPI:`${starturlSedapal}/api/util/update/equipos`,//PROY-00013
    TeamAPI: `${starturlSedapal}/api/util/equipos`,
    EmailConocimientoAPI: `${starturlSedapal}/api/conocimiento/correo`,
    EmailAutoEvaluacionAPI: `${starturlSedapal}/api/autoevaluacion/correo`,
    EmailEvaluacionAPI: `${starturlSedapal}/api/evaluacion/correo`,
    KnowledgeReportAPI: `${starturlSedapal}/api/reportes/conocimiento`,
    GetEvalGroupAPI: `${starturlSedapal}/api/reportes/grupoevaluacion`, 
    UpdateEvalGroup: `${starturlSedapal}/api/util/grupoEvaluacion`,
    GetAutoEvalProgression: `${starturlSedapal}/api/autoevaluacion`,
    AutoEvalReportAPI: `${starturlSedapal}/api/reportes/autoevaluacion`,
    GetPeopleToBeEvaluated: `${starturlSedapal}/api/evaluacion`,
    GetWorkerEvaluationData: `${starturlSedapal}/api/evaluacion/get`,
    SaveWorkerEvaluationData: `${starturlSedapal}/api/evaluacion`,
    GetOutStandingFactsFromWorker: `${starturlSedapal}/api/hechos`,
    PostSaveOutStandingFactForWorker: `${starturlSedapal}/api/hechos/`,
    GetEvaluatorsReport: `${starturlSedapal}/api/reportes/evaluadores`,
    GetWorkersFromEvaluatorReport: `${starturlSedapal}/api/evaluacion`,
    GetWorkersPreEvaluations90: `${starturlSedapal}/api/evaluacion/pre`,
    GetWorkersPreEvaluations180: `${starturlSedapal}/api/evaluacion/pre180`,
    GetConsolidate: `${starturlSedapal}/api/evaluacion/consolidado`,
    GetFeedbackReportfromSelectedEvaluator: `${starturlSedapal}/api/retroalimentacion`,
    PostSaveEvaluatedFeedback: `${starturlSedapal}/api/retroalimentacion/saveEvaluado`,
    PostSaveEvaluatorFeedback: `${starturlSedapal}/api/retroalimentacion/saveEvaluador`,
    PostGetEvaluatorsFeedbackProgression: `${starturlSedapal}/api/reportes/retroalimentacion`,
    GetIndicatorsListForMultiselect: `${starturlSedapal}/api/util/constantes/indicador`,
    GetDeliverablesListForMultiselect: `${starturlSedapal}/api/util/constantes/entregable`,
    GetPIDandCompliancePIDReportfromEvaluator: `${starturlSedapal}/api/pid`,
    GetCompetenciesForSelect: `${starturlSedapal}/api/competencias/desaprobados`,
    GetEvaluatedPIDTable: `${starturlSedapal}/api/pid/get`,
    GetEvaluatedByFichaForCalibration: `${starturlSedapal}/api/calibracion/ficha`,
    GetCalibrationEvaluatedReport: `${starturlSedapal}/api/calibracion/lista`,
    PostSaveCalibration: `${starturlSedapal}/api/calibracion/save`,
    PostSaveEvaluatorPID: `${starturlSedapal}/api/pid`,
    GetSendEvaluatorNotification: `${starturlSedapal}/api/calibracion/correo`,
    SaveEvaluatorVerdictPID: `${starturlSedapal}/api/pid/veredictoRegistro`,
    PutEvaluatedComplianceUploadFile: `${starturlSedapal}/api/pid/archivo`,
    SaveEvaluatorVerdictCompliancePID: `${starturlSedapal}/api/pid/veredictoCumplimiento`,
    GetGlobalFeedback90: `${starturlSedapal}/api/reportes/global90`,
    GetPidAdminReport: `${starturlSedapal}/api/reportes/pid`,
    SendPIDEvaluatorNotification: `${starturlSedapal}/api/pid/correoEvaluador`,
    SendPIDEvaluatedNotification: `${starturlSedapal}/api/pid/correoEvaluado`,
    SendEvaluatedForDoFeedback: `${starturlSedapal}/api/retroalimentacion/correoEvaluado`,
    SendEvaluatorForDoFeedback: `${starturlSedapal}/api/retroalimentacion/correoEvaluador`,
    PIDCreateUpdateDeleteConstants: `${starturlSedapal}/api/util/constantes/save`,
    GetFeedbackStatus: `${starturlSedapal}/api/retroalimentacion`,
    PostUpdateFeedbackDates: `${starturlSedapal}/api/util/update/periodo/retroalimentacion`,
    PostChangeEvaluatedCalibrationPeriodDate: `${starturlSedapal}/api/calibracion/update/fechalimite`,
    GetEvaluationsFromEvaluated180: `${starturlSedapal}/api/evaluacion/getAll`,
    GetFeedbackEvaluationID: `${starturlSedapal}/api/evaluacion/getId`,
    GetEvaluationGlobal180FromWorker:  `${starturlSedapal}/api/reportes/global180`,
    getCalendarVigencies: `${starturlSedapal}/api/util/calendariosListar`,
    PostInsertCalendar: `${starturlSedapal}/api/util/calendario`,
    GetPeriodicity: `${starturlSedapal}/api/util/constantes/periodicidad`,
    GetCalibrationFromEvaluated90: `${starturlSedapal}/api/evaluacion/get90`,
    GetCalibrationFromEvaluated180: `${starturlSedapal}/api/evaluacion/get180`,
    GetAdminReport: `${starturlSedapal}/api/directorio/admin/listar`,
    GetWorkerInfoForRegisterAdminModal: `${starturlSedapal}/api/directorio/ficha`,
    GetAdminInfo: `${starturlSedapal}/api/directorio/admin/ficha`,
    PostSaveAdmin: `${starturlSedapal}/api/directorio/admin/insertar`,
    getMembersTeam: `${starturlSedapal}/api/directorio/equipos/listar180`,//PROY-00013
    GetUnidadOrganizativa :`${starturlSedapal}/api/grupoEvaluacion/listarUnidadOrganizativa`, //PROY-00013
    PutUpdateAdmin: `${starturlSedapal}/api/directorio/admin/editar`,
    GetCompetenciesGroupReport: `${starturlSedapal}/api/grupocompetencias`,
    GetCompetenciesReport: `${starturlSedapal}/api/competencias`,
    GetLevelsReport:  `${starturlSedapal}/api/nivel`,
    GetBehaviorsReport:  `${starturlSedapal}/api/comportamiento`,
    PostSendCompetenciesExcelForValidation: `${starturlSedapal}/api/competencias/cargaMasiva/validacion`,
    PostSendCompetenciesExcelForSave: `${starturlSedapal}/api/competencias/cargaMasiva/insertar`,
    PostSendBehaviorsExcelForValidation: `${starturlSedapal}/api/comportamiento/cargaMasiva/validacion`,
    PostSendBehaviorsExcelForSave: `${starturlSedapal}/api/comportamiento/cargaMasiva/insertar`,
    GetAsignationGroupsReport: `${starturlSedapal}/api/grupoEvaluacionAsignacion/listado`,
    PostPutAsignationGroupsReport: `${starturlSedapal}/api/grupoEvaluacionAsignacion`,
    GetWorkerDataFromPositionCode: `${starturlSedapal}/api/directorio/puesto`,
    PostSendAsignationGroupsExcelForValidation: `${starturlSedapal}/api/grupoEvaluacionAsignacion/cargaMasiva/validacion`,
    PostSendAsignationGroupsExcelForSave: `${starturlSedapal}/api/grupoEvaluacionAsignacion/cargaMasiva/insertar`,
    GetCalendarDataForCalcRules: `${starturlSedapal}/api/util/reglaCalculo/obtener`,
    PostCalendarDataForCalcRules: `${starturlSedapal}/api/util/reglaCalculo/insertar`,
    PutCalendarDataForCalcRules: `${starturlSedapal}/api/util/reglaCalculo/editar`,
    GetEvalAsignationReport: `${starturlSedapal}/api/evaluacionAsignacion/listado`,
    PostPutEvalAsignationReport: `${starturlSedapal}/api/evaluacionAsignacion`,
    PostSendEvalAsignationExcelForValidation: `${starturlSedapal}/api/evaluacionAsignacion/cargaMasiva/validacion`,
    PostSendEvalAsignationExcelForSave: `${starturlSedapal}/api/evaluacionAsignacion/cargaMasiva/insertar`,
    PostEvaluatorsFactsReport: `${starturlSedapal}/api/reportes/hechos`,
    GetEvalGroupsReportCRUD: `${starturlSedapal}/api/grupoEvaluacion/listar`,
    PostEvalGroupsCRUD: `${starturlSedapal}/api/grupoEvaluacion/insertar`,
    PutEvalGroupsCRUD: `${starturlSedapal}/api/grupoEvaluacion/editar`,
    GetEvalGroupsDetailReportCRUD:  `${starturlSedapal}/api/grupoEvaluacion/detalle/listar`,
    PostEvalGroupsDetailCRUD: `${starturlSedapal}/api/grupoEvaluacion/detalle/insertar`,
    PutEvalGroupsDetailCRUD: `${starturlSedapal}/api/grupoEvaluacion/detalle/editar`,
    GetParametrizationProgress: `${starturlSedapal}/api/util/parametrizacion`,
    GetPIDEvaluatedValidation: `${starturlSedapal}/api/pid/condicion`,
    PostPIDEvaluatedValidation: `${starturlSedapal}/api/pid/condicion`,
    PostPutEvalAsignation180: `${starturlSedapal}/api/evaluacionAsignacion/180`,
    GetWorkerForException: `${starturlSedapal}/api/excepcion/ficha`,
    GetWorkerForExceptionFindByTeam: `${starturlSedapal}/api/excepcion/equipo`,
    GetOrganicUnitsForException: `${starturlSedapal}/api/util/uo`,
    PostSaveAndSendWorkersForException: `${starturlSedapal}/api/excepcion/save`,
    GetExceptionReportTypeEvaluatedByEvaluator: `${starturlSedapal}/api/excepcion/lista`,
    GetFinishedEvaluatorsEvaluations: `${starturlSedapal}/api/evaluacion/aprobados`,
    GetHistoricEvaluatedFirstEvaluation90: `${starturlSedapal}/api/evaluacion/get/primeraEvaluacion`,
    GetHistoricEvaluatedFirstEvaluation180: `${starturlSedapal}/api/evaluacion/get/primeraEvaluacion`,
    GetHistoricEvalutedsByEvaluatorReport: `${starturlSedapal}/api/hechos/lista`,
    PostUpdateExceptionLimitDate: `${starturlSedapal}/api/excepcion/update/fechalimite`,
    GetEvaluatedExceptionFlags: `${starturlSedapal}/api/excepcion/evaluado`,
    GetEvaluatorExceptionFlags: `${starturlSedapal}/api/excepcion/evaluador`,
    GetAdminExceptionReports: `${starturlSedapal}/api/reportes/excepcion`,
    GetExceptionReportTypeFeedbackEvaluatedByEvaluator: '',
    GetExceptionReportTypePIDEvaluatedByEvaluator: '',
    GetEvaluatorStatusForPhase: `${starturlSedapal}/api/util/evaluado/validacion`
};