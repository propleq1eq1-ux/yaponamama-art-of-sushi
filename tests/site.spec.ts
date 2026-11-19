import {expect,test} from '@playwright/test';

test('filters, searches, adds quantities, persists and removes a demo order',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-ready','true',{timeout:25_000});
  await page.getByRole('button',{name:'Супы',exact:true}).click();
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.getByRole('searchbox').fill('nonexistent');
  await expect(page.getByText('Блюда не найдены.')).toBeVisible();
  await page.getByRole('button',{name:'Очистить поиск'}).click();
  await page.getByRole('button',{name:'Сливочный суп с лососем',exact:true}).first().click();
  const dialog=page.getByRole('dialog');
  await dialog.getByRole('button',{name:'Увеличить количество'}).click();
  await dialog.getByRole('button',{name:/Добавить/}).click();
  await expect(dialog).toHaveCount(0);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-ready','true',{timeout:25_000});
  await page.getByRole('button',{name:'Корзина 2'}).click();
  await expect(dialog.locator('.cart-total strong')).toHaveText(/138.000 сум/);
  await dialog.getByRole('button',{name:'Уменьшить количество'}).click();
  await expect(dialog.locator('.cart-total strong')).toHaveText(/69.000 сум/);
  await expect(dialog.getByRole('link',{name:'На официальный сайт'})).toHaveAttribute('href','https://yaponamama.uz/brand/yaponamama');
  await dialog.getByRole('button',{name:/удалить/}).click();
  await expect(dialog.getByText('В корзине пока пусто.')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await page.getByRole('combobox').selectOption('en');
  await expect(page.getByRole('heading',{name:'THE ART OF SUSHI.'})).toBeVisible();
  await page.getByRole('combobox').selectOption('uz');
  await expect(page.getByRole('heading',{name:'SUSHI SAN’ATI.'})).toBeVisible();
});

test('WebGL story scrubs both ways and packaging controls respond',async({page})=>{
  const errors:string[]=[];
  page.on('pageerror', error=>errors.push(error.message));
  await page.setViewportSize({width:1100,height:740});
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-ready','true',{timeout:25_000});
  const story=page.locator('#story');
  await expect(story.locator('canvas')).toBeVisible({timeout:20_000});
  const go=async(name:string)=>{
    const stage=story.getByRole('button',{name,exact:true});
    await stage.click();
    await expect(stage).toHaveAttribute('aria-current','step',{timeout:15_000});
  };
  await go('Сборка');
  await go('Сворачивание');
  await go('Нарезка');
  await go('Подача');
  await expect(story.getByRole('slider')).toBeVisible();
  await story.getByRole('slider').press('ArrowRight');
  await go('Упаковка');
  await go('Меню');
  await expect(story.getByRole('link',{name:'Смотреть меню'})).toHaveAttribute('href','#menu');
  await go('Ингредиенты');
  const packaging=page.locator('#packaging');
  await packaging.scrollIntoViewIfNeeded();
  await expect(packaging.locator('canvas')).toBeVisible();
  const open=packaging.getByRole('button',{name:'Открыть коробку'});
  await open.click();
  await expect(packaging.getByRole('button',{name:'Закрыть коробку'})).toHaveAttribute('aria-pressed','true');
  await packaging.getByRole('button',{name:'Повернуть коробку'}).click();
  await packaging.getByRole('button',{name:'Приблизить'}).click();
  await packaging.getByRole('button',{name:'Сбросить вид'}).click();
  await expect(open).toHaveAttribute('aria-pressed','false');
  expect(errors).toEqual([]);
});

test('mobile reduced motion shows chapter controls and a functional package fallback',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-ready','true',{timeout:25_000});
  await expect(page.locator('canvas')).toHaveCount(0);
  const story=page.locator('#story');
  await story.getByRole('button',{name:'Нарезка'}).click();
  await expect(story.getByRole('heading',{name:'ВОСЕМЬ КУСОЧКОВ СЧАСТЬЯ'})).toBeVisible();
  await page.getByRole('button',{name:'Открыть коробку'}).click();
  await expect(page.locator('.css-box')).toHaveClass(/opened/);
  const width=await page.evaluate(()=>document.documentElement.scrollWidth);
  expect(width).toBe(390);

});
