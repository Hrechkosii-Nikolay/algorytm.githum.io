const nav=document.querySelector('.main-nav');
const menuButton=document.querySelector('.menu-toggle');
const menuIconUse=menuButton?.querySelector('.menu-toggle__icon use');
const menuIconBase=menuIconUse?.getAttribute('href')?.split('#')[0]||'./img/sprite.svg';
const isEnglish=document.documentElement.lang==='en';
const submenuItems=document.querySelectorAll('.has-submenu');

const closeMenu=()=>{
  if(!nav||!menuButton)return;
  nav.classList.remove('is-menu-open');
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded','false');
  menuButton.setAttribute('aria-label',isEnglish?'Open menu':'Відкрити меню');
  menuIconUse?.setAttribute('href',`${menuIconBase}#menu`);
};

if(nav&&menuButton){
  menuButton.addEventListener('click',()=>{
    const isOpen=nav.classList.toggle('is-menu-open');
    document.body.classList.toggle('menu-open',isOpen);
    menuButton.setAttribute('aria-expanded',String(isOpen));
    menuButton.setAttribute('aria-label',isEnglish?(isOpen?'Close menu':'Open menu'):(isOpen?'Закрити меню':'Відкрити меню'));
    menuIconUse?.setAttribute('href',`${menuIconBase}#${isOpen?'close':'menu'}`);
  });
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
}

submenuItems.forEach(item=>{
  const button=item.querySelector('.submenu-toggle');
  if(!button)return;
  button.addEventListener('click',()=>{
    const isOpen=item.classList.toggle('is-open');
    button.setAttribute('aria-expanded',String(isOpen));
  });
});

const faqItems=document.querySelectorAll('#faq details');

faqItems.forEach(item=>{
  item.addEventListener('toggle',()=>{
    if(!item.open)return;
    faqItems.forEach(otherItem=>{
      if(otherItem!==item)otherItem.open=false;
    });
  });
});

const phoneInputs=document.querySelectorAll('.input-tel');
const phoneErrorMessage='Будь ласка, введіть повний номер телефону';
const internationalPhoneErrorMessage='Enter a valid international phone number including the country code';

const sanitizeInternationalPhone=value=>{
  let sanitized=value.replace(/[^0-9+\s().-]/g,'');
  const hasPlus=sanitized.includes('+');
  sanitized=sanitized.replace(/\+/g,'').trimStart();

  let digitCount=0;
  sanitized=[...sanitized].filter(character=>{
    if(!/\d/.test(character))return true;
    digitCount+=1;
    return digitCount<=15;
  }).join('');

  return hasPlus?`+${sanitized}`:sanitized;
};

const updateInternationalPhoneValidity=input=>{
  const value=input.value.trim();
  const digits=value.replace(/\D/g,'');
  const hasOnlyPhoneCharacters=/^\+[0-9\s().-]+$/.test(value);
  const isComplete=hasOnlyPhoneCharacters&&digits.length>=7&&digits.length<=15&&digits[0]!=='0';
  input.setCustomValidity(!value||isComplete?'':internationalPhoneErrorMessage);
  if(isComplete)input.removeAttribute('aria-invalid');
};

const getNationalPhoneDigits=value=>{
  const hasCountryCode=/^\s*\+?38/.test(value);
  let digits=value.replace(/\D/g,'');

  if(digits.startsWith('38'))digits=digits.slice(2);
  else if(digits.startsWith('80'))digits=digits.slice(1);

  if(digits&&!digits.startsWith('0')&&!hasCountryCode)digits=`0${digits}`;
  return digits.slice(0,10);
};

const formatPhone=value=>{
  const digits=getNationalPhoneDigits(value);
  if(!digits)return'';

  let formatted=`+38 (${digits.slice(0,3)}`;
  if(digits.length>=3)formatted+=')';
  if(digits.length>3)formatted+=digits.slice(3,6);
  if(digits.length>6)formatted+=`-${digits.slice(6,8)}`;
  if(digits.length>8)formatted+=`-${digits.slice(8,10)}`;
  return formatted;
};

const updatePhoneValidity=input=>{
  const digits=getNationalPhoneDigits(input.value);
  const isComplete=digits.length===10&&digits.startsWith('0');
  input.setCustomValidity(!digits||isComplete?'':phoneErrorMessage);
  if(isComplete)input.removeAttribute('aria-invalid');
};

const getPhoneCaretPosition=(value,nationalDigitCount)=>{
  if(!value||nationalDigitCount<=0)return value?value.indexOf('(')+1:0;

  let totalDigits=0;
  let nationalDigits=0;

  for(let index=0;index<value.length;index+=1){
    if(!/\d/.test(value[index]))continue;
    totalDigits+=1;
    if(totalDigits<=2)continue;
    nationalDigits+=1;
    if(nationalDigits===nationalDigitCount)return index+1;
  }

  return value.length;
};

phoneInputs.forEach(input=>{
  if(isEnglish){
    input.maxLength=25;
    input.placeholder='+44 20 1234 5678';

    input.addEventListener('beforeinput',event=>{
      if(typeof event.data==='string'&&/[^0-9+\s().-]/.test(event.data))event.preventDefault();
    });
    input.addEventListener('input',()=>{
      input.value=sanitizeInternationalPhone(input.value);
      updateInternationalPhoneValidity(input);
    });
    input.addEventListener('blur',()=>updateInternationalPhoneValidity(input));
    input.addEventListener('invalid',()=>input.setAttribute('aria-invalid','true'));
    return;
  }

  input.addEventListener('focus',()=>{
    if(input.value)return;
    input.value='+38 (0';
    updatePhoneValidity(input);
    input.setSelectionRange(input.value.length,input.value.length);
  });

  input.addEventListener('beforeinput',event=>{
    const isBackward=event.inputType==='deleteContentBackward';
    const isForward=event.inputType==='deleteContentForward';
    if(!isBackward&&!isForward)return;

    const selectionStart=input.selectionStart??0;
    const selectionEnd=input.selectionEnd??selectionStart;
    if(selectionStart!==selectionEnd)return;

    const nationalDigits=getNationalPhoneDigits(input.value);
    const digitsBeforeCaret=input.value
      .slice(0,selectionStart)
      .replace(/\D/g,'');
    const nationalDigitsBeforeCaret=Math.max(0,digitsBeforeCaret.length-2);
    const deleteIndex=isBackward
      ?nationalDigitsBeforeCaret-1
      :nationalDigitsBeforeCaret;

    if(deleteIndex<0||deleteIndex>=nationalDigits.length){
      if(isBackward&&nationalDigitsBeforeCaret===0){
        event.preventDefault();
        input.value='';
        updatePhoneValidity(input);
      }
      return;
    }

    event.preventDefault();
    const remainingDigits=
      nationalDigits.slice(0,deleteIndex)+nationalDigits.slice(deleteIndex+1);
    input.value=formatPhone(remainingDigits?`+38 ${remainingDigits}`:'');
    updatePhoneValidity(input);

    const nextDigitPosition=isBackward
      ?nationalDigitsBeforeCaret-1
      :nationalDigitsBeforeCaret;
    const nextCaretPosition=getPhoneCaretPosition(input.value,nextDigitPosition);
    input.setSelectionRange(nextCaretPosition,nextCaretPosition);
  });

  input.addEventListener('input',()=>{
    input.value=formatPhone(input.value);
    updatePhoneValidity(input);
    input.setSelectionRange(input.value.length,input.value.length);
  });

  input.addEventListener('blur',()=>{
    if(getNationalPhoneDigits(input.value)==='0')input.value='';
    updatePhoneValidity(input);
  });

  input.addEventListener('invalid',()=>{
    input.setAttribute('aria-invalid','true');
  });
});

document.addEventListener('keydown',event=>{
  if(event.key!=='Escape')return;
  closeMenu();
  submenuItems.forEach(item=>{
    item.classList.remove('is-open');
    item.querySelector('.submenu-toggle')?.setAttribute('aria-expanded','false');
  });
});

const year=document.querySelector('#year');
if(year)year.textContent=String(new Date().getFullYear());

const contactForms=document.querySelectorAll('[data-contact-form]');

contactForms.forEach(contactForm=>{
  const contactStatus=contactForm.querySelector('[data-contact-status]');
  if(!contactStatus)return;
  contactForm.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!contactForm.reportValidity())return;

    const data=new FormData(contactForm);
    const shareTitle=isEnglish?'Enquiry for Algorithm Law Firm':'Звернення до АО «Алгоритм»';
    const text=isEnglish
      ?`${shareTitle}\nName: ${data.get('name')}\nPhone: ${data.get('phone')}\nQuestion: ${data.get('message')}`
      :`${shareTitle}\nІм’я: ${data.get('name')}\nТелефон: ${data.get('phone')}\nЗапитання: ${data.get('message')}`;

    try{
      if(navigator.share){
        await navigator.share({title:shareTitle,text});
        contactStatus.textContent=isEnglish
          ?'Choose an app to send your enquiry.'
          :'Оберіть зручний застосунок, щоб надіслати звернення.';
        return;
      }
      await navigator.clipboard.writeText(text);
      contactStatus.textContent=isEnglish
        ?'The enquiry has been copied. Send it using your preferred messenger or call us.'
        :'Текст звернення скопійовано. Надішліть його у зручному месенджері або зателефонуйте нам.';
    }catch(error){
      if(error?.name!=='AbortError'){
        contactStatus.textContent=isEnglish
          ?'We could not prepare the enquiry. Please call us on +38 063 244 65 82.'
          :'Не вдалося підготувати звернення. Зателефонуйте нам: +38 063 244 65 82.';
      }
    }
  });
});

const contactModal=document.querySelector('[data-contact-modal]');
const contactModalOpeners=document.querySelectorAll('[data-open-contact-modal]');
const contactModalCloser=document.querySelector('[data-close-contact-modal]');

const closeContactModal=()=>{
  if(!contactModal?.open)return;
  contactModal.close();
  document.body.classList.remove('modal-open');
};

if(contactModal){
  contactModalOpeners.forEach(button=>{
    button.addEventListener('click',()=>{
      contactModal.showModal();
      document.body.classList.add('modal-open');
    });
  });
  contactModalCloser?.addEventListener('click',closeContactModal);
  contactModal.addEventListener('click',event=>{
    if(event.target===contactModal)closeContactModal();
  });
  contactModal.addEventListener('close',()=>document.body.classList.remove('modal-open'));
}
