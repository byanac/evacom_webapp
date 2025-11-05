import { MenuItem } from "src/app/interfaces/MenuItem";

export const EvaluatedMenuItems: MenuItem[] = [
  {
    name: 'Fase de Conocimiento',
    onlycanseeEvaluated: true,
    route: 'fase-conocimiento',
    adminOnly: false,
    startCalendarName: 'dConoIni',
    endCalendarName: 'dEvalFin',
    exceptionFlagName: 'habilitadoConocimiento',
    svg: `<svg class="w-6 h-6 text-gray-white"  xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M8 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1h2a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2Zm6 1h-4v2H9a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2h-1V4Zm-3 8a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-2-1a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H9Zm2 5a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-2-1a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H9Z" clip-rule="evenodd"/></svg>`
  },
  {
    name: 'Fase de Autoevaluación',
    onlycanseeEvaluated: true,
    route: 'fase-autoevaluacion',
    startCalendarName: 'dAutoIni',
    endCalendarName: 'dAutoFin',
    exceptionFlagName: 'habilitadoAutoevaluacion',
    adminOnly: false,
    svg: `<svg class="w-6 h-6 text-gray-white"  xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M9 2a1 1 0 0 0-1 1H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2a1 1 0 0 0-1-1H9Zm1 2h4v2h1a1 1 0 1 1 0 2H9a1 1 0 0 1 0-2h1V4Zm5.707 8.707a1 1 0 0 0-1.414-1.414L11 14.586l-1.293-1.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z" clip-rule="evenodd"/></svg>`
  },
  {
    name: 'Fase de Retroalimentación',
    onlycanseeEvaluated: true,
    route: 'registro-retroalimentacion',
    startCalendarName: 'dRetroIni',
    endCalendarName: 'dRetroFin',
    exceptionFlagName: 'habilitadoRetroalimentacion',
    adminOnly: false,
    svg: `<svg class="w-6 h-6 text-gray-white"  xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M9 2a1 1 0 0 0-1 1H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2a1 1 0 0 0-1-1H9Zm1 2h4v2h1a1 1 0 1 1 0 2H9a1 1 0 0 1 0-2h1V4Zm5.707 8.707a1 1 0 0 0-1.414-1.414L11 14.586l-1.293-1.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z" clip-rule="evenodd"/></svg>`
  },
];
