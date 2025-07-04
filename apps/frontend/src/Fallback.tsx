import React from 'react';

export const makeFallback = (error: Error) =>
  <div className="error-message">{error.toString()}</div>;