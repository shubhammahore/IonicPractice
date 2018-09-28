import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LimitPipe } from './limit/limit';
import { Safepipe } from './safe/safe';

@NgModule({
	declarations: [
		Safepipe,
		LimitPipe,
	],
	exports: [
		Safepipe,
		LimitPipe,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PipesModule {

}