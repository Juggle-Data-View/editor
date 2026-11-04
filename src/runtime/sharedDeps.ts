import React from 'react';
import ReactDOM from 'react-dom';
import echarts from 'echarts';

/**
 * Host copies of libraries remote bundles may require().
 * Bundles must not ship their own React or echarts.
 */
export const SHARED_DEPS: Record<string, unknown> = {
  react: React,
  'react-dom': ReactDOM,
  echarts,
};

export const SHARED_DEP_NAMES = Object.keys(SHARED_DEPS);
