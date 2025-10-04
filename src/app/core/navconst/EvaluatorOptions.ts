import { MenuItem } from "src/app/interfaces/MenuItem";

export const EvaluatorOptions: MenuItem[] = [
    {
      name: 'Fase de Retroalimentación',
      onlycanseeChiefEvaluator: true,
      onlycanseeEvaluator: true,
      startCalendarName: 'dRetroIni',
      endCalendarName: 'dRetroFin',
      exceptionFlagName: 'habilitadoRetroalimentacion',
      route: 'evaluador-reporte-retroalimentacion',
      svg: `<svg class="w-6 h-6 text-gray-white "  xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M9 2a1 1 0 0 0-1 1H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2a1 1 0 0 0-1-1H9Zm1 2h4v2h1a1 1 0 1 1 0 2H9a1 1 0 0 1 0-2h1V4Zm5.707 8.707a1 1 0 0 0-1.414-1.414L11 14.586l-1.293-1.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z" clip-rule="evenodd"/></svg>`
    },
    {
      name: 'Validación de PID',
      onlycanseeEvaluator: true,
      startCalendarName: 'dPidEstIni',
      endCalendarName: 'dPidEstFin',
      exceptionFlagName: 'habilitadoPIDRegistro',
      route: 'evaluador-validacion-pid',
      svg: `<svg class="w-6 h-6 text-gray-white "  xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M9 2a1 1 0 0 0-1 1H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2a1 1 0 0 0-1-1H9Zm1 2h4v2h1a1 1 0 1 1 0 2H9a1 1 0 0 1 0-2h1V4Zm5.707 8.707a1 1 0 0 0-1.414-1.414L11 14.586l-1.293-1.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z" clip-rule="evenodd"/></svg>`
    },
    {
      name: 'Seguimiento de cumplimiento de PID',
      onlycanseeEvaluator: true,
      startCalendarName: 'dPidEvalIni',
      endCalendarName: 'dPidEvalFin',
      exceptionFlagName: 'habilitadoPIDCumplimiento',
      route: 'evaluador-seguimiento-pid',
      svg: `<svg class="w-6 h-6 text-gray-white "  xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M9 2a1 1 0 0 0-1 1H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2a1 1 0 0 0-1-1H9Zm1 2h4v2h1a1 1 0 1 1 0 2H9a1 1 0 0 1 0-2h1V4Zm5.707 8.707a1 1 0 0 0-1.414-1.414L11 14.586l-1.293-1.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z" clip-rule="evenodd"/></svg>`
    }
  ];