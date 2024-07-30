/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable multiline-ternary */
/* eslint-disable unicorn/consistent-destructuring */
import React, { useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { COLORS_LIST, DEFAULT_COLOR } from '@/constants';
import { useLocale } from '@/locales';

interface IPropsColorPicker {
  highlight?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onChange?: (color: any) => void;
  setSelectedColor?: (color: any) => void;
  selectedColor?: string;
}

const colorsArray = COLORS_LIST;
const chunkedColors: any = [];
for (let i = 0; i < colorsArray.length; i += 10) {
  chunkedColors.push(colorsArray.slice(i, i + 10));
}

const ColorPicker = (props: IPropsColorPicker) => {
  const { t } = useLocale();

  const { highlight = false, disabled = false, selectedColor, setSelectedColor, onChange } = props;

  const [recentColorsStore, setRecentColorsStore] = useState<string[]>([]);

  const html5Color = React.createRef<HTMLInputElement>();

  const setRecentColor = (color: string) => {
    const newRecentColors = [...recentColorsStore];
    const index = newRecentColors.indexOf(color);
    if (index !== -1) {
      newRecentColors.splice(index, 1);
    }
    newRecentColors.unshift(color);
    if (newRecentColors.length > 10) {
      newRecentColors.pop();
    }
    setRecentColorsStore(newRecentColors);
  };

  function setColor(color: string | undefined) {
    if (color === undefined) {
      // clear color
      setSelectedColor?.(color);
      onChange?.(color);
      return;
    }
    // check if color is correct
    const isCorrectColor = /^#([\da-f]{3}){1,2}$/i.test(color);
    if (isCorrectColor) {
      setSelectedColor?.(color);
      onChange?.(color);
      setRecentColor(color);
    }
  }
  const triggerHtml5Color = () => {
    html5Color.current?.click();
  };

  return (
    <Popover>
      <PopoverTrigger disabled={disabled}>{props?.children}</PopoverTrigger>

      <PopoverContent hideWhenDetached className='p-2 w-full h-full' align='start' side='bottom'>
        <div className='flex flex-col'>
          {highlight ? (
            <div
              className='flex items-center p-1 rd-1 cursor-pointer hover:bg-accent'
              onClick={() => setColor(undefined)}
            >
              <span className='w-6 h-6 p-0.5 inline-block rounded-sm border cursor-pointer hover:border-border hover:shadow-sm relative after:border-b-2 after:border-b-red-500 after:top-[10px] after:h-0 after:left-0 after:w-6 after:absolute after:block after:rotate-[45deg]'>
                <span
                  style={{
                    backgroundColor: 'transparent',
                  }}
                >
                  <svg
                    viewBox='0 0 18 18'
                    style={{
                      fill: 'rgba(0, 0, 0, 0.4)',
                      display: 'none',
                    }}
                  >
                    <path d='M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z'></path>
                  </svg>
                </span>
              </span>
              <span className='text-sm ml-1'>{t('editor.nofill')}</span>
            </div>
          ) : (
            <>
              <div
                className='flex items-center p-1 rd-1 cursor-pointer hover:bg-accent'
                onClick={() => {
                  setColor(undefined);
                }}
              >
                <span className='w-6 h-6 p-0.5 inline-block rounded-sm border border-transparent cursor-pointer'>
                  <span
                    style={{
                      backgroundColor: DEFAULT_COLOR,
                    }}
                    className='relative w-[18px] h-[18px] block rounded-[2px] border-transparent'
                  >
                    <svg
                      viewBox='0 0 18 18'
                      style={{
                        fill: 'rgb(255, 255, 255)',
                        display: 'none',
                      }}
                    >
                      <path d='M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z'></path>
                    </svg>
                  </span>
                </span>
                <span className='text-sm ml-1'>{t('editor.default')}</span>
              </div>
            </>
          )}

          {chunkedColors.map((items: string[], index: number) => {
            return (
              <span className='flex p-0 w-full h-auto relative last:pb-2' key={index}>
                {items.map((item: string, idx) => {
                  return (
                    <span
                      className='w-6 h-6 p-0.5 inline-block rounded-sm border border-transparent flex-[0 0 auto] cursor-pointer hover:border-border hover:shadow-sm'
                      key={`sub-color-${idx}`}
                      onClick={() => setColor(item)}
                    >
                      <span
                        style={{
                          backgroundColor: item,
                        }}
                        className='relative w-[18px] h-[18px] block rounded-[2px] border-transparent'
                      >
                        {item === selectedColor ? (
                          <svg
                            className='absolute top-[-1px] left-[1px] w-3 h-3'
                            viewBox='0 0 18 18'
                            style={{
                              fill: 'rgb(255, 255, 255)',
                              display: 'block',
                            }}
                          >
                            <path d='M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z'></path>
                          </svg>
                        ) : (
                          <svg
                            viewBox='0 0 18 18'
                            style={{
                              fill: 'rgb(255, 255, 255)',
                              display: 'none',
                            }}
                          >
                            <path d='M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z'></path>
                          </svg>
                        )}
                      </span>
                    </span>
                  );
                })}
              </span>
            );
          })}

          <div>
            <div className='text-sm my-1'>{t('editor.recent')}</div>
            <span className='flex p-0 w-full h-auto relative last:pb-2'>
              {recentColorsStore?.map((item, index) => {
                return (
                  <span
                    className='w-6 h-6 p-0.5 inline-block rounded-sm border border-transparent flex-[0 0 auto] cursor-pointer hover:border-border hover:shadow-sm'
                    key={index}
                    onClick={() => setColor(item)}
                  >
                    <span
                      className='relative w-[18px] h-[18px] block rounded-[2px] border-transparent'
                      style={{
                        backgroundColor: item,
                      }}
                    >
                      <svg
                        viewBox='0 0 18 18'
                        style={{
                          fill: 'rgb(255, 255, 255)',
                          display: 'none',
                        }}
                      >
                        <path d='M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z'></path>
                      </svg>
                    </span>
                  </span>
                );
              })}
            </span>
          </div>

          {/* <div className='relative'>
            <div
              className='text-sm hover:cursor-pointer hover:bg-accent py-1.5 px-1.5'
              onClick={triggerHtml5Color}
            >
              {t('editor.color.more')}...
            </div>
            <input
              type='color'
              ref={html5Color}
              onChange={(e: any) => {
                setColor(e.target.value);
              }}
              className='absolute left-0 top-4'
              style={{
                visibility: 'hidden',
              }}
            />
          </div> */}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;