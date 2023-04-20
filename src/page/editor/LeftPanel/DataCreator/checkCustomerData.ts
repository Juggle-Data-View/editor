enum ErrorReason {
  JSON = 0,
  LEN = 1,
  VALID_FORMAT = 2,
}

interface ErrorMSG {
  status: boolean;
  msg: string;
  reason: ErrorReason;
}

const isJSON = (data: string) => {
  try {
    const dataObj = JSON.parse(data);
    return { status: !!dataObj, parseData: dataObj };
  } catch (error) {
    return {
      status: false,
    };
  }
};

const isValidLen = (data: string) => {
  return data.length > 5000 ? false : true;
};

const checkCustomerData = (data: string): ErrorMSG | null => {
  const { parseData, status } = isJSON(data);
  if (status) {
    return {
      status: false,
      msg: 'JSON format error',
      reason: ErrorReason.JSON,
    };
  }
  if (!isValidLen(data)) {
    return {
      status: false,
      msg: 'Data length is too long. Please reduce the length of the data or use the CSV data source.',
      reason: ErrorReason.LEN,
    };
  }

  if (Array.isArray(parseData) && parseData.length > 0 && typeof parseData[0] === 'object') {
    return {
      status: true,
      msg: 'The data is not in the correct format. Please check the data format.',
      reason: ErrorReason.VALID_FORMAT,
    };
  }

  return null;
};

export default checkCustomerData;
