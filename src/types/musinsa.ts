/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MusinsaProduct {
  title: string;
  image: string;
  price: string;
  brand: string;
  url: string;
}

export interface MusinsaSearchResponse {
  success: boolean;
  products: MusinsaProduct[];
  error?: string;
}
