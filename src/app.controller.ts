import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): any {
    return "Hello World!!!";
  }

  @Post('/GetPurchaseRequisition')
  getPurchaseRequisition(@Body() body) {
    console.log(body);
    return this.appService.getPurchaseRequisition(body);
  }

  @Post('/CreatePurchaseRequisition')
  async createPurchaseRequisition(@Body() body) {
    debugger
    return this.appService.createPurchaseRequisition(body);
  }

  @Post('/GetPurchaseOrder')
  getPurchaseOrder(@Body() body): any {
    return this.appService.getPurchaseOrder(body);
  }

  @Post('/CreatePurchaseOrder')
  async createPurchaseOrder(@Body() body) {
    debugger
    return this.appService.createPurchaseOrder(body);
  }

  @Post('/GetBom')
  getBom(@Body() body): any {
    return this.appService.getBom(body);
  }

  @Post('/GetWarehouseMonitoring')
  getWarehouseMonitoring(@Body() body): any {
    return this.appService.getWarehouseMonitoring(body);
  }

  @Post('/GetCostManagement')
  getCostManagement(@Body() body): any {
    return this.appService.getCostManagement(body);
  }

  @Post('/GetItemReceipt')
  getItemReceipt(@Body() body): any {
    return this.appService.getItemReceipt(body);
  }

  @Post('/GetIntercompanyTransferOrder')
  getIntercompanyTransferOrder(@Body() body): any {
    return this.appService.getIntercompanyTransferOrder(body);
  }

  @Post('/GetVendorBill')
  getVendorBill(@Body() body): any {
    return this.appService.getVendorBill(body);
  }

  @Post('/GetVendorPayment')
  getVendorPayment(@Body() body): any {
    return this.appService.getVendorPayment(body);
  }

}
