/**
 * 处理文件
 */

declare global {
  interface Window {
    BlobBuilder: any;
    WebKitBlobBuilder: any;
    MozBlobBuilder: any;
  }
}

const file = {
  /**
   * 图片URL转Image对象
   * @param url 图片地址
   * @param cros 跨域资源共享(CORS)设置
   */
  url2img: (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      // 需要图片 header 中支持：access-control-allow-origin: *
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (e) => {
        reject(new Error(`图片${url}加载错误!`));
      };
      img.src = url;
    });
  },

  /**
   * img对象转canvas对象
   */
  img2canvas: (img: HTMLImageElement): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    if (ctx) {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    return canvas;
  },

  canvas2dataURL: (canvas: HTMLCanvasElement, type?: string, quality?: any) => {
    return canvas.toDataURL(type, quality);
  },

  canvas2Blob: (canvas: HTMLCanvasElement, callback: BlobCallback, type?: string, quality?: any) => {
    return canvas.toBlob(callback, type, quality);
  },

  /**
   * dataURL 转成 blob
   * via: https://qiutc.me/post/uploading-image-file-in-mobile-fe.html
   * @param dataURL
   * @return blob
   */
  dataURL2blob(dataURL: string) {
    const arr = dataURL.split(',');
    const binaryString = atob(arr[1]);
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const intArray = new Uint8Array(arrayBuffer);
    const mime = (arr[0] as any).match(/:(.*?);/)[1];
    for (let i = 0, j = binaryString.length; i < j; i++) {
      intArray[i] = binaryString.charCodeAt(i);
    }
    const data = [intArray];
    let result;
    try {
      result = new Blob(data, { type: mime });
    } catch (error) {
      window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
      if (error.name === 'TypeError' && window.BlobBuilder) {
        const builder = new window.BlobBuilder();
        builder.append(arrayBuffer);
        result = builder.getBlob(mime);
      } else {
        throw new Error('没救了');
      }
    }
    return result;
  },

  /**
   * 将base64转换为file对象
   * @param {String} dataURL    base64数据
   * @param {String} filename   文件名
   * ----------------------------
   * 注意：低版本ios，v9.3(含)以下不兼容 File constructor
   * https://github.com/Esri/offline-editor-js/issues/357
   * https://caniuse.com/#search=File
   */
  dataURL2file(dataURL: string, filename = 'autoDV') {
    try {
      const arr: any[] = dataURL.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      filename += '.' + mime.split('/')[1];
      return new File([u8arr], filename, {
        type: mime,
      });
    } catch (error) {
      console.warn('Browser does not support the File constructor,Will use blob instead of file');
      return this.dataURL2blob(dataURL);
    }
  },

  /**
   * file 转成 dataURL
   * @param file 文件
   * @param callback 回调函数
   */
  file2dataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (e: any) {
        resolve(e.target.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  blob2file(blob: Blob, fileName?: string) {
    return new File([blob], fileName || 'autoDV');
  },
};

export default file;
