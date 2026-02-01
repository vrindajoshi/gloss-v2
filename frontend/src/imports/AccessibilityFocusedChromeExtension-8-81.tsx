import svgPaths from "./svg-kjlzwlrbtq";

function App() {
  return <div className="absolute h-0 left-0 top-0 w-[722px]" data-name="App" />;
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[8.875px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[14px] text-white top-0 tracking-[0.32px]">g</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative rounded-[10px] shrink-0 size-[32px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(251, 100, 182) 0%, rgb(255, 184, 106) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Text />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="flex-[1_0_0] h-[28px] min-h-px min-w-px relative" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto_Serif:Bold',sans-serif] font-bold leading-[28px] left-0 text-[#171717] text-[18px] top-[0.5px] tracking-[0.32px]" style={{ fontVariationSettings: "'GRAD' 0, 'wdth' 100" }}>
          Gloss
        </p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[32px] relative shrink-0 w-[92.617px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container3 />
        <Heading />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M12 4L4 12" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M4 4L12 12" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute bg-gradient-to-r content-stretch flex from-[#fdf2f8] h-[66px] items-center justify-between left-px pb-[2px] px-[24px] to-[#fff7ed] top-[2px] w-[308px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#fccee8] border-b-2 border-solid inset-0 pointer-events-none" />
      <Container2 />
      <Button />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="bg-[#fafafa] h-[16px] relative shrink-0 w-[310px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Roboto_Serif:Italic',sans-serif] font-normal italic leading-[16px] left-[155.38px] text-[#737373] text-[12px] text-center top-0 tracking-[0.32px]" style={{ fontVariationSettings: "'GRAD' 0, 'wdth' 100" }}>
          Simplify any article for easier reading
        </p>
      </div>
    </div>
  );
}

function PrimitiveLabel() {
  return (
    <div className="h-[24px] relative shrink-0 w-[114.242px]" data-name="Primitive.label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="font-['Roboto_Serif:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 text-[#171717] text-[16px] tracking-[0.32px]" style={{ fontVariationSettings: "'GRAD' 0, 'wdth' 100" }}>
          Reading Level
        </p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="bg-gradient-to-r from-[#fb64b6] h-[32px] relative rounded-[16777200px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 to-[#ff8904] w-[87.984px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Roboto_Serif:Bold',sans-serif] font-bold h-[20px] leading-[20px] left-[43.98px] text-[14px] text-center text-white top-[7px] tracking-[0.32px] w-[72px] whitespace-pre-wrap" style={{ fontVariationSettings: "'GRAD' 0, 'wdth' 100" }}>
          Grade 9
        </p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex h-[32px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel />
      <Text1 />
    </div>
  );
}

function Text3() {
  return <div className="bg-gradient-to-r from-[#fb64b6] h-[16px] shrink-0 to-[#ff8904] w-full" data-name="Text" />;
}

function Text2() {
  return (
    <div className="absolute bg-[#e5e5e5] content-stretch flex flex-col h-[16px] items-start left-0 overflow-clip pr-[98.25px] rounded-[16777200px] top-0 w-[262px]" data-name="Text">
      <Text3 />
    </div>
  );
}

function Slider() {
  return <div className="absolute bg-white border-2 border-[#fb64b6] border-solid left-[151.25px] rounded-[16777200px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)] size-[20px] top-[-2px]" data-name="Slider" />;
}

function PrimitiveSpan() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Primitive.span">
      <Text2 />
      <Slider />
    </div>
  );
}

function Text4() {
  return (
    <div className="bg-white h-[16px] relative shrink-0 w-[47.203px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto_Serif:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#525252] text-[12px] top-0 tracking-[0.32px]" style={{ fontVariationSettings: "'GRAD' 0, 'wdth' 100" }}>
          Grade 4
        </p>
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="bg-white h-[16px] relative shrink-0 w-[54.195px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto_Serif:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#525252] text-[12px] top-0 tracking-[0.32px]" style={{ fontVariationSettings: "'GRAD' 0, 'wdth' 100" }}>
          Grade 12
        </p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between px-[4px] relative size-full">
        <Text4 />
        <Text5 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[40px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveSpan />
      <Container9 />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] h-[124px] items-start relative shrink-0 w-full" data-name="Container">
      <Container7 />
      <Container8 />
    </div>
  );
}

function PrimitiveLabel1() {
  return (
    <div className="content-stretch flex h-[24px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Roboto_Serif:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 text-[#171717] text-[16px] tracking-[0.32px]" style={{ fontVariationSettings: "'GRAD' 0, 'wdth' 100" }}>
        Accessibility
      </p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2250fb80} id="Vector" stroke="var(--stroke-0, #A1A1A1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M7.5 16.6667H12.5" id="Vector_2" stroke="var(--stroke-0, #A1A1A1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 3.33333V16.6667" id="Vector_3" stroke="var(--stroke-0, #A1A1A1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto_Serif:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#404040] text-[14px] top-0 tracking-[0.32px]" style={{ fontVariationSettings: "'GRAD' 0, 'wdth' 100" }}>
          Easy-Read Font
        </p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[20px] relative shrink-0 w-[139.242px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Icon1 />
        <Text6 />
      </div>
    </div>
  );
}

function PrimitiveSpan1() {
  return <div className="bg-white rounded-[16777200px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 size-[16px]" data-name="Primitive.span" />;
}

function PrimitiveButton() {
  return (
    <div className="bg-[#d4d4d4] h-[18.398px] relative rounded-[16777200px] shrink-0 w-[32px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center p-px relative size-full">
        <PrimitiveSpan1 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="bg-white h-[56px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[18px] py-[2px] relative size-full">
          <Container12 />
          <PrimitiveButton />
        </div>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p33e8610} id="Vector" stroke="var(--stroke-0, #A1A1A1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2ed10d00} id="Vector_2" stroke="var(--stroke-0, #A1A1A1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pd903d00} id="Vector_3" stroke="var(--stroke-0, #A1A1A1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text7() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto_Serif:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#404040] text-[14px] top-0 tracking-[0.32px]" style={{ fontVariationSettings: "'GRAD' 0, 'wdth' 100" }}>
          Text-to-Speech
        </p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[20px] relative shrink-0 w-[130.641px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Icon2 />
        <Text7 />
      </div>
    </div>
  );
}

function PrimitiveSpan2() {
  return <div className="bg-white rounded-[16777200px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 size-[16px]" data-name="Primitive.span" />;
}

function PrimitiveButton1() {
  return (
    <div className="bg-[#d4d4d4] h-[18.398px] relative rounded-[16777200px] shrink-0 w-[32px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center p-px relative size-full">
        <PrimitiveSpan2 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="bg-white h-[56px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[18px] py-[2px] relative size-full">
          <Container14 />
          <PrimitiveButton1 />
        </div>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p25dc7400} id="Vector" stroke="var(--stroke-0, #A1A1A1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, #A1A1A1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto_Serif:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#404040] text-[14px] top-0 tracking-[0.32px]" style={{ fontVariationSettings: "'GRAD' 0, 'wdth' 100" }}>
          Focus Mode
        </p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[20px] relative shrink-0 w-[113.836px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Icon3 />
        <Text8 />
      </div>
    </div>
  );
}

function PrimitiveSpan3() {
  return <div className="bg-white rounded-[16777200px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 size-[16px]" data-name="Primitive.span" />;
}

function PrimitiveButton2() {
  return (
    <div className="bg-[#d4d4d4] h-[18.398px] relative rounded-[16777200px] shrink-0 w-[32px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center p-px relative size-full">
        <PrimitiveSpan3 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="bg-white h-[56px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[18px] py-[2px] relative size-full">
          <Container16 />
          <PrimitiveButton2 />
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[240px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel1 />
      <Container11 />
      <Container13 />
      <Container15 />
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-[#fafafa] flex-[1_0_0] min-h-px min-w-px relative w-[310px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[40px] items-start overflow-clip pt-[24px] px-[24px] relative rounded-[inherit] size-full">
        <Container6 />
        <Container10 />
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-[60.45px] size-[16px] top-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_7_99)" id="Icon">
          <path d={svgPaths.p319d7580} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M13.3333 2V4.66667" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14.6667 3.33333H12" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2.66667 11.3333V12.6667" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M3.33333 12H2" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_7_99">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-gradient-to-r from-[#fb64b6] h-[56px] relative rounded-[8px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] shrink-0 to-[#ff8904] w-full" data-name="Button">
      <Icon4 />
      <p className="-translate-x-1/2 absolute font-['Roboto_Serif:Bold',sans-serif] font-bold leading-[24px] left-[147.95px] text-[16px] text-center text-white top-[15.5px] tracking-[0.32px]" style={{ fontVariationSettings: "'GRAD' 0, 'wdth' 100" }}>
        Simplify Page
      </p>
    </div>
  );
}

function Container17() {
  return (
    <div className="bg-white h-[106px] relative shrink-0 w-[310px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-solid border-t-2 inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[26px] px-[24px] relative size-full">
        <Button1 />
      </div>
    </div>
  );
}

function SidePanel() {
  return (
    <div className="bg-[#fafafa] content-stretch flex flex-col gap-[24px] h-[697px] items-start pt-[12px] relative shrink-0 w-full" data-name="SidePanel">
      <Paragraph />
      <Container5 />
      <Container17 />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute bg-[#fafafa] content-stretch flex flex-col h-[695px] items-start left-px overflow-clip top-[68px] w-[308px]" data-name="Container">
      <SidePanel />
    </div>
  );
}

function Container() {
  return (
    <div className="bg-white flex-[1_0_0] h-[765px] min-h-px min-w-px relative rounded-[15px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Container1 />
        <Container4 />
      </div>
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none rounded-[15px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function ResizablePanel() {
  return (
    <div className="absolute bg-[#fafafa] content-stretch flex h-[763px] items-start left-[722px] pl-[2px] top-0 w-[320px]" data-name="ResizablePanel">
      <div aria-hidden="true" className="absolute border-[#fda5d5] border-l-2 border-solid inset-0 pointer-events-none shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)]" />
      <Container />
    </div>
  );
}

export default function AccessibilityFocusedChromeExtension() {
  return (
    <div className="bg-white relative size-full" data-name="Accessibility-focused Chrome extension">
      <App />
      <ResizablePanel />
    </div>
  );
}