export interface MenuItem {
    name: string;
    route?: string;
    svg?: string;
    adminOnly?: boolean;
    OpenModal?: boolean;
    type?: string;
    onlycanseeEvaluated?: boolean;
    onlycanseeEvaluator?: boolean;
    onlycanseeChiefEvaluator?: boolean;
    startCalendarName?: string;
    endCalendarName?: string;
    exceptionFlagName?: string;
  }
  