import { SireneV3Response } from '../../responseModels/sireneV3';

export function isSireneV3Response(store: any): store is SireneV3Response {
  return store.hasOwnProperty('etablissement');
}
