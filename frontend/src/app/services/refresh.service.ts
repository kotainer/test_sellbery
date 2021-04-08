import {Injectable} from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RefreshService {
    public hasChangesSubject$ = new Subject<void>();
}