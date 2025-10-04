import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ModalsService {
 // Estado del modal de autorización de calibración
 private showModals: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
 showModals$: Observable<boolean> = this.showModals.asObservable();
  
 // Estado del modal de autorización de calibración
 private autorizateCalibrationModalVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
 autorizateCalibrationModalVisible$: Observable<boolean> = this.autorizateCalibrationModalVisible.asObservable();

  // Tipo de calendario para el modal de autorización de calibración
 private autorizateCalibrationModalType: BehaviorSubject<string> = new BehaviorSubject<string>('');
 autorizateCalibrationModalType$: Observable<string> = this.autorizateCalibrationModalType.asObservable();

 // Estado del modal de reporte consolidado de evaluación
 private evalConsolidatedReportModalVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
 evalConsolidatedReportModalVisible$: Observable<boolean> = this.evalConsolidatedReportModalVisible.asObservable();

 // Estado de visibilidad del p-dialog
 private FactsDataModalVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
 FactsDataModalVisible$: Observable<boolean> = this.FactsDataModalVisible.asObservable();

 // Estado del modal de excepciones
 private exceptionModalVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
 exceptionModalVisible$: Observable<boolean> = this.exceptionModalVisible.asObservable();

  // Tipo de calendario para el modal de excepciones
 private ExceptionModalType: BehaviorSubject<string> = new BehaviorSubject<string>('');
 ExceptionModalType$: Observable<string> = this.ExceptionModalType.asObservable();

  constructor() {}

  // Métodos para actualizar el estado
  setModalsVisible(): void {
    this.showModals.next(true);
  }

  setModalsHided(): void {
    this.showModals.next(false);
  }

  setAutorizateCalibrationModalVisible(): void {
    this.autorizateCalibrationModalVisible.next(true);
    this.setModalsVisible();
  }

  setAutorizateCalibrationModalHided(): void {
    this.autorizateCalibrationModalVisible.next(false);
    this.setModalsHided();
  }

  setEvalConsolidatedReportModalVisible(): void {
    this.evalConsolidatedReportModalVisible.next(true);
    this.setModalsVisible();
  }

  setEvalConsolidatedReportModalHided(): void {
    this.evalConsolidatedReportModalVisible.next(false);
    this.setModalsHided();
  }

  setFactsDataModalVisible(): void {
    this.FactsDataModalVisible.next(true);
    this.setModalsVisible();
  }

  setFactsDataModalVisibleHided(): void {
    this.FactsDataModalVisible.next(false);
    this.setModalsHided();
  }

  setautorizateCalibrationModalType(value: string): void {
    this.autorizateCalibrationModalType.next(value);
  }

  eraseautorizateCalibrationModalType(): void {
    this.autorizateCalibrationModalType.next("");
  }

  setExceptionModalVisible(): void {
    this.exceptionModalVisible.next(true);
    this.setModalsVisible();
  }

  setExceptionModalVisibleHided(): void {
    this.exceptionModalVisible.next(false);
    this.setModalsHided();
  }

  setExceptionModalType(value: string): void {
    this.ExceptionModalType.next(value);
  }

  eraseExceptionModalType(): void {
    this.ExceptionModalType.next("");
  }


  // Métodos para obtener el estado actual y valores
  getShowModalsStatus(): Observable<boolean> {
    return this.showModals$;
  }

  getAutorizateCalibrationModalStatus(): Observable<boolean> {
    return this.autorizateCalibrationModalVisible$;
  }

  getAutorizateCalibrationModalType(): Observable<string> {
    return this.autorizateCalibrationModalType$;
  }

  getEvalConsolidatedReportModalStatus(): Observable<boolean> {
    return this.evalConsolidatedReportModalVisible$;
  }

  getFactsDataModalStatus(): Observable<boolean> {
    return this.FactsDataModalVisible$;
  }

  getExceptionModalStatus(): Observable<boolean> {
    return this.exceptionModalVisible$;
  }

  getExceptionType(): Observable<string> {
    return this.ExceptionModalType$;
  }

}
