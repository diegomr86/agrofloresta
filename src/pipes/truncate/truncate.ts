import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 195, completeWords = false, ellipsis = '...') {
    
    var doc = new DOMParser().parseFromString(value, 'text/html');
    value = doc.body.textContent || "";
    if (!value || value.endsWith('...') || value.length <= limit) {
    	return value;
    } else {
	    if (completeWords) {
	      limit = value.substr(0, 13).lastIndexOf(' ');
	    }
	    return `${value.substr(0, limit)}${ellipsis}`;
	  }
  }
}
