import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular';
import { HomePage } from './home.page';

describe('HomePage', () => {
  it('se puede crear sin consultar la API real', async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideRouter([]), provideIonicAngular(),
        provideHttpClient(), provideHttpClientTesting(),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(HomePage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
