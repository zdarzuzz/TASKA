"""One real cross-role path inside the same browser context (demo only)."""
from pathlib import Path
from datetime import date, timedelta
from playwright.sync_api import sync_playwright
import re
ROOT=Path(__file__).parent

def setup(page):
    html=re.sub(r'<script src="[^"]+" defer></script>','',(ROOT/'index.html').read_text())
    html=re.sub(r'<link[^>]+>', '', html)
    page.set_content(html,wait_until='domcontentloaded')
    page.add_style_tag(content=(ROOT/'styles.css').read_text())
    page.add_script_tag(content=(ROOT/'app.js').read_text())
    page.add_script_tag(content=(ROOT/'presentation.js').read_text())

with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':900})
    page.set_default_timeout(6500)
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    setup(page)
    page.locator('.tile.cus').click()
    page.locator('#a-name').fill('Компания тест')
    page.locator('#f-auth button').click()
    page.locator('#p-about').fill('Студия с короткими коммерческими задачами')
    page.locator('#f-profile button').click()
    task='Разработать презентацию для тестового клиента'
    page.locator('#c-title').fill(task)
    page.locator('#c-budget').fill('6000')
    page.locator('#c-deadline').fill((date.today()+timedelta(days=27)).isoformat())
    page.locator('#c-desc').fill('Нужна презентация на десять слайдов с оформлением диаграмм и двумя итоговыми файлами.')
    page.locator('#c-terms').fill('Передать слайды PPTX и PDF с исправлениями')
    page.locator('[data-act=publish]').click()
    page.wait_for_timeout(1750)
    assert 'Принимает отклики' in page.locator('#app').inner_text()
    page.locator('.stage-controls [data-a=switch]').click()
    item=page.locator('#app article[data-a=go]').filter(has_text=task).first
    assert item.is_visible()
    item.click()
    page.locator('[data-a=resp-on]').click()
    page.locator('#resp-msg').fill('Я готов выполнить презентацию и собрать аккуратные диаграммы за три дня.')
    page.locator('#f-resp button').click()
    page.locator('.stage-controls [data-a=switch]').click()
    page.locator('#app article[data-x=task]').filter(has_text=task).click()
    own=page.locator('#app article.card').filter(has_text='Демо Студент')
    assert own.count()==1
    own.locator('[data-a=choose]').click()
    page.locator('.stage-controls [data-a=switch]').click()
    page.locator('#app nav [data-x=my]').click()
    page.locator('#app article[data-x=task]').filter(has_text=task).click()
    assert 'Вас выбрали' in page.locator('#app').inner_text()
    page.locator('[data-a=s-confirm]').click()
    page.locator('.stage-controls [data-a=switch]').click()
    page.locator('#app article[data-x=task]').filter(has_text=task).click()
    assert 'подтвердил готовность' in page.locator('#app').inner_text()
    page.locator('#st-ok').check()
    page.locator('#f-start button').click()
    page.locator('.stage-controls [data-a=switch]').click()
    page.locator('#app nav [data-x=my]').click()
    page.locator('#app article[data-x=task]').filter(has_text=task).click()
    page.locator('#sub-link').fill('https://example.com/pptx')
    page.locator('#f-submit button').click()
    page.locator('.stage-controls [data-a=switch]').click()
    page.locator('#app article[data-x=task]').filter(has_text=task).click()
    page.locator('[data-a=accept]').click()
    page.locator('[data-a=pay]').click()
    assert 'Задача завершена' in page.locator('#app').inner_text()
    assert not errors,errors
    print('PASS customer create → student applies → customer chooses → student confirms → start → delivery → accept → demo pay')
    browser.close()
