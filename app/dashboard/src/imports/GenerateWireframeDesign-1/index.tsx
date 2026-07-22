import svgPaths from "./svg-7pakakal3k";
import imgContainer from "./97e3160c170c3b0c0e2ef6fc17335bd1e23871d5.png";

function Container1() {
  return <div className="absolute bg-white left-[344px] opacity-5 rounded-[22369600px] size-[128px] top-[-24px]" data-name="Container" />;
}

function Container2() {
  return <div className="absolute bg-white left-[376px] opacity-5 rounded-[22369600px] size-[80px] top-[40px]" data-name="Container" />;
}

function Container5() {
  return (
    <div className="relative rounded-[14px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1)] shrink-0 size-[40px]" data-name="Container">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none rounded-[14px] size-full" src={imgContainer} />
    </div>
  );
}

function Text() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[18px] text-white tracking-[0.45px] whitespace-nowrap">SmartAttendance</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container5 />
        <Text />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p3d8d0000} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M12 12.75L15.75 9L12 5.25" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M15.75 9H6.75" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[rgba(255,255,255,0.15)] relative rounded-[14px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Button />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[24px] top-[24px] w-[400px]" data-name="Container">
      <Container4 />
      <Container6 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="Icon">
          <path d={svgPaths.p843c990} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83333" />
          <path d={svgPaths.p1848f500} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83333" />
        </g>
      </svg>
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] relative rounded-[16px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#bedbff] text-[12px] whitespace-nowrap">Xin chào</p>
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[24px] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">GV001 - Trương Xuân Việt</p>
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#bedbff] text-[12px] whitespace-nowrap">Thứ Sáu, 10/07/2026</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0 w-[197.073px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph />
        <Paragraph1 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-center left-[24px] top-[84px] w-[400px]" data-name="Container">
      <Container8 />
      <Container9 />
    </div>
  );
}

function Header() {
  return (
    <div className="bg-gradient-to-r from-[#1447e6] h-[164px] relative shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 to-[#2b7fff] w-full" data-name="Header">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Container1 />
        <Container2 />
        <Container3 />
        <Container7 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M15 4.5L6.75 12.75L3 9" id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Container13() {
  return (
    <div className="bg-[#dcfce7] content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[36px]" data-name="Container">
      <Icon2 />
    </div>
  );
}

function ContainerMargin1() {
  return (
    <div className="relative shrink-0" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[6px] relative size-full">
        <Container13 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute bg-white content-stretch drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1),0px_2px_2px_rgba(0,0,0,0.1)] flex flex-col items-center left-0 p-[12px] rounded-[16px] top-0 w-[130.667px]" data-name="Container">
      <ContainerMargin1 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[#1e2939] text-[20px] whitespace-nowrap">5</p>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">Có mặt</p>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_3_342)" id="Icon">
          <path d={svgPaths.p3dc49580} id="Vector" stroke="var(--stroke-0, #FE9A00)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 4.5V9L12 10.5" id="Vector_2" stroke="var(--stroke-0, #FE9A00)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_3_342">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container15() {
  return (
    <div className="bg-[#fef3c6] content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[36px]" data-name="Container">
      <Icon3 />
    </div>
  );
}

function ContainerMargin2() {
  return (
    <div className="relative shrink-0" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[6px] relative size-full">
        <Container15 />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute bg-white content-stretch drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1),0px_2px_2px_rgba(0,0,0,0.1)] flex flex-col items-center left-[142.67px] p-[12px] rounded-[16px] top-0 w-[130.667px]" data-name="Container">
      <ContainerMargin2 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[#1e2939] text-[20px] whitespace-nowrap">2</p>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">Đi trễ</p>
    </div>
  );
}

function Text1() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#fb2c36] text-[14px] whitespace-nowrap">✗</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="bg-[#ffe2e2] content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[36px]" data-name="Container">
      <Text1 />
    </div>
  );
}

function ContainerMargin3() {
  return (
    <div className="relative shrink-0" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[6px] relative size-full">
        <Container17 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute bg-white content-stretch drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1),0px_2px_2px_rgba(0,0,0,0.1)] flex flex-col items-center left-[285.33px] p-[12px] rounded-[16px] top-0 w-[130.667px]" data-name="Container">
      <ContainerMargin3 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[#1e2939] text-[20px] whitespace-nowrap">2</p>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">Vắng</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[110px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container12 />
        <Container14 />
        <Container16 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[142px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[16px] relative size-full">
        <Container11 />
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="relative shrink-0 w-full" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">Chọn học phần</p>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M9 5.25V15.75" id="Vector" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p2044ea00} id="Vector_2" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="flex-[290.667_0_0] h-[20px] min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#1e2939] text-[14px] whitespace-nowrap">CT295 - Nhập môn IoT</p>
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M4.5 6.75L9 11.25L13.5 6.75" id="Vector" stroke="var(--stroke-0, #51A2FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[14px] shrink-0 w-[384px]" data-name="Button">
      <div aria-hidden className="absolute border-[#dbeafe] border-[0.667px] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[16.667px] py-[12.667px] relative size-full">
        <Icon4 />
        <Text2 />
        <Icon5 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[53.333px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <Button1 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="bg-white drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[16px] relative size-full">
        <Label />
        <Container20 />
      </div>
    </div>
  );
}

function Label1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">Chọn phòng - buổi học</p>
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p29439780} id="Vector" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p18c84c80} id="Vector_2" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="flex-[290.667_0_0] h-[20px] min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#1e2939] text-[14px] whitespace-nowrap">Phòng 106/DI - Sáng 01/07/2026 lúc 7:00</p>
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M4.5 6.75L9 11.25L13.5 6.75" id="Vector" stroke="var(--stroke-0, #51A2FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[14px] shrink-0 w-[384px]" data-name="Button">
      <div aria-hidden className="absolute border-[#dbeafe] border-[0.667px] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[16.667px] py-[12.667px] relative size-full">
        <Icon6 />
        <Text3 />
        <Icon7 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[53.333px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <Button2 />
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="bg-white drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start p-[16px] relative size-full">
        <Label1 />
        <Container22 />
      </div>
    </div>
  );
}

function ContainerMargin4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <Container21 />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="relative shrink-0" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[27px] not-italic relative shrink-0 text-[#1e2939] text-[18px] whitespace-nowrap">Danh sách điểm danh</p>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="bg-[#f3f4f6] relative rounded-[22369600px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">7 sinh viên</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Heading />
        <Text4 />
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Icon">
          <path d={svgPaths.p220e9c00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p1de9fb00} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[12px] top-[13.17px]" data-name="Container">
      <Icon8 />
    </div>
  );
}

function TextInput() {
  return (
    <div className="absolute bg-[#f9fafb] h-[41.333px] left-0 rounded-[14px] top-0 w-[384px]" data-name="Text Input">
      <div className="content-stretch flex flex-col items-start justify-center overflow-clip pl-[36.667px] pr-[16.667px] py-[10.667px] relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#99a1af] text-[14px] w-full">Tìm MSSV hoặc tên sinh viên...</p>
      </div>
      <div aria-hidden className="absolute border-[#e5e7eb] border-[0.667px] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[41.333px] relative shrink-0 w-full" data-name="Container">
      <Container27 />
      <TextInput />
    </div>
  );
}

function ContainerMargin6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <Container26 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#f3f4f6] border-b-[0.667px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12.667px] pt-[16px] px-[16px] relative size-full">
        <Container25 />
        <ContainerMargin6 />
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="bg-[#f9fafb] h-[36.667px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#f3f4f6] border-b-[0.667px] border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] bg-clip-padding border-0 border-[transparent] border-solid font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative size-full text-[#6a7282] text-[12px] whitespace-nowrap">
        <p className="absolute left-[16px] top-[10px]">#</p>
        <p className="absolute left-[48px] top-[10px]">MSSV</p>
        <p className="absolute left-[144px] top-[10px]">Họ và tên</p>
        <p className="-translate-x-1/2 absolute left-[336px] text-center top-[10px]">Có mặt</p>
        <p className="-translate-x-1/2 absolute left-[384px] text-center top-[10px]">Trễ</p>
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p3de7e600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#00c950] drop-shadow-[0px_4px_3px_#b9f8cf,0px_2px_2px_#b9f8cf] relative rounded-[22369600px] shrink-0 size-[28px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon9 />
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute content-stretch flex items-start justify-center left-[304px] top-[12px] w-[64px]" data-name="Container">
      <Button3 />
    </div>
  );
}

function Button4() {
  return <div className="bg-[#e5e7eb] relative rounded-[22369600px] shrink-0 size-[28px]" data-name="Button" />;
}

function Container32() {
  return (
    <div className="absolute content-stretch flex items-start justify-center left-[368px] top-[12px] w-[32px]" data-name="Container">
      <Button4 />
    </div>
  );
}

function Container30() {
  return (
    <div className="bg-white h-[52.667px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#f9fafb] border-b-[0.667px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[16px] not-italic text-[#99a1af] text-[12px] top-[18px] whitespace-nowrap">1</p>
        <p className="[word-break:break-word] absolute font-['Consolas:Regular',sans-serif] leading-[16px] left-[48px] not-italic text-[#4a5565] text-[12px] top-[18px] whitespace-nowrap">B2303808</p>
        <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[144px] not-italic text-[#1e2939] text-[12px] top-[18.5px] whitespace-nowrap">Võ Nhựt Hảo</p>
        <Container31 />
        <Container32 />
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p3de7e600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#00c950] drop-shadow-[0px_4px_3px_#b9f8cf,0px_2px_2px_#b9f8cf] relative rounded-[22369600px] shrink-0 size-[28px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon10 />
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute content-stretch flex items-start justify-center left-[304px] top-[12px] w-[64px]" data-name="Container">
      <Button5 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_3_328)" id="Icon">
          <path d={svgPaths.p3e7757b0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M6 3V6L8 7" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_3_328">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#ffb900] drop-shadow-[0px_4px_3px_#fee685,0px_2px_2px_#fee685] relative rounded-[22369600px] shrink-0 size-[28px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon11 />
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute content-stretch flex items-start justify-center left-[368px] top-[12px] w-[32px]" data-name="Container">
      <Button6 />
    </div>
  );
}

function Container33() {
  return (
    <div className="bg-white h-[52.667px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#f9fafb] border-b-[0.667px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[16px] not-italic text-[#99a1af] text-[12px] top-[18px] whitespace-nowrap">2</p>
        <p className="[word-break:break-word] absolute font-['Consolas:Regular',sans-serif] leading-[16px] left-[48px] not-italic text-[#4a5565] text-[12px] top-[18px] whitespace-nowrap">B2303813</p>
        <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[144px] not-italic text-[#1e2939] text-[12px] top-[18.5px] whitespace-nowrap">Trần Thị Thúy Hiền</p>
        <Container34 />
        <Container35 />
      </div>
    </div>
  );
}

function Button7() {
  return <div className="bg-[#e5e7eb] relative rounded-[22369600px] shrink-0 size-[28px]" data-name="Button" />;
}

function Container37() {
  return (
    <div className="absolute content-stretch flex items-start justify-center left-[304px] top-[12px] w-[64px]" data-name="Container">
      <Button7 />
    </div>
  );
}

function Button8() {
  return <div className="bg-[#f3f4f6] opacity-40 relative rounded-[22369600px] shrink-0 size-[28px]" data-name="Button" />;
}

function Container38() {
  return (
    <div className="absolute content-stretch flex items-start justify-center left-[368px] top-[12px] w-[32px]" data-name="Container">
      <Button8 />
    </div>
  );
}

function Container36() {
  return (
    <div className="bg-[rgba(254,242,242,0.4)] h-[52.667px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#f9fafb] border-b-[0.667px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[16px] not-italic text-[#99a1af] text-[12px] top-[18px] whitespace-nowrap">3</p>
        <p className="[word-break:break-word] absolute font-['Consolas:Regular',sans-serif] leading-[16px] left-[48px] not-italic text-[#4a5565] text-[12px] top-[18px] whitespace-nowrap">B2303821</p>
        <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[144px] not-italic text-[#1e2939] text-[12px] top-[18.5px] whitespace-nowrap">Nguyễn Văn Khoa</p>
        <Container37 />
        <Container38 />
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p3de7e600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-[#00c950] drop-shadow-[0px_4px_3px_#b9f8cf,0px_2px_2px_#b9f8cf] relative rounded-[22369600px] shrink-0 size-[28px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon12 />
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute content-stretch flex items-start justify-center left-[304px] top-[12px] w-[64px]" data-name="Container">
      <Button9 />
    </div>
  );
}

function Button10() {
  return <div className="bg-[#e5e7eb] relative rounded-[22369600px] shrink-0 size-[28px]" data-name="Button" />;
}

function Container41() {
  return (
    <div className="absolute content-stretch flex items-start justify-center left-[368px] top-[12px] w-[32px]" data-name="Container">
      <Button10 />
    </div>
  );
}

function Container39() {
  return (
    <div className="bg-white h-[52.667px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#f9fafb] border-b-[0.667px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[16px] not-italic text-[#99a1af] text-[12px] top-[18px] whitespace-nowrap">4</p>
        <p className="[word-break:break-word] absolute font-['Consolas:Regular',sans-serif] leading-[16px] left-[48px] not-italic text-[#4a5565] text-[12px] top-[18px] whitespace-nowrap">B2303835</p>
        <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[144px] not-italic text-[#1e2939] text-[12px] top-[18.5px] whitespace-nowrap">Lê Thị Lan Anh</p>
        <Container40 />
        <Container41 />
      </div>
    </div>
  );
}

function Button11() {
  return <div className="bg-[#e5e7eb] relative rounded-[22369600px] shrink-0 size-[28px]" data-name="Button" />;
}

function Container43() {
  return (
    <div className="absolute content-stretch flex items-start justify-center left-[304px] top-[12px] w-[64px]" data-name="Container">
      <Button11 />
    </div>
  );
}

function Button12() {
  return <div className="bg-[#f3f4f6] opacity-40 relative rounded-[22369600px] shrink-0 size-[28px]" data-name="Button" />;
}

function Container44() {
  return (
    <div className="absolute content-stretch flex items-start justify-center left-[368px] top-[12px] w-[32px]" data-name="Container">
      <Button12 />
    </div>
  );
}

function Container42() {
  return (
    <div className="bg-[rgba(254,242,242,0.4)] h-[52.667px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#f9fafb] border-b-[0.667px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[16px] not-italic text-[#99a1af] text-[12px] top-[18px] whitespace-nowrap">5</p>
        <p className="[word-break:break-word] absolute font-['Consolas:Regular',sans-serif] leading-[16px] left-[48px] not-italic text-[#4a5565] text-[12px] top-[18px] whitespace-nowrap">B2303847</p>
        <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[144px] not-italic text-[#1e2939] text-[12px] top-[18.5px] whitespace-nowrap">Phạm Minh Tuấn</p>
        <Container43 />
        <Container44 />
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p3de7e600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
      </svg>
    </div>
  );
}

function Button13() {
  return (
    <div className="bg-[#00c950] drop-shadow-[0px_4px_3px_#b9f8cf,0px_2px_2px_#b9f8cf] relative rounded-[22369600px] shrink-0 size-[28px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon13 />
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="absolute content-stretch flex items-start justify-center left-[304px] top-[12px] w-[64px]" data-name="Container">
      <Button13 />
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_3_328)" id="Icon">
          <path d={svgPaths.p3e7757b0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M6 3V6L8 7" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_3_328">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button14() {
  return (
    <div className="bg-[#ffb900] drop-shadow-[0px_4px_3px_#fee685,0px_2px_2px_#fee685] relative rounded-[22369600px] shrink-0 size-[28px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon14 />
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="absolute content-stretch flex items-start justify-center left-[368px] top-[12px] w-[32px]" data-name="Container">
      <Button14 />
    </div>
  );
}

function Container45() {
  return (
    <div className="bg-white h-[52.667px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#f9fafb] border-b-[0.667px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[16px] not-italic text-[#99a1af] text-[12px] top-[18px] whitespace-nowrap">6</p>
        <p className="[word-break:break-word] absolute font-['Consolas:Regular',sans-serif] leading-[16px] left-[48px] not-italic text-[#4a5565] text-[12px] top-[18px] whitespace-nowrap">B2303852</p>
        <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[144px] not-italic text-[#1e2939] text-[12px] top-[18.5px] whitespace-nowrap">Huỳnh Thị Kim Ngân</p>
        <Container46 />
        <Container47 />
      </div>
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p3de7e600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
      </svg>
    </div>
  );
}

function Button15() {
  return (
    <div className="bg-[#00c950] drop-shadow-[0px_4px_3px_#b9f8cf,0px_2px_2px_#b9f8cf] relative rounded-[22369600px] shrink-0 size-[28px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon15 />
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="absolute content-stretch flex items-start justify-center left-[304px] top-[12px] w-[64px]" data-name="Container">
      <Button15 />
    </div>
  );
}

function Button16() {
  return <div className="bg-[#e5e7eb] relative rounded-[22369600px] shrink-0 size-[28px]" data-name="Button" />;
}

function Container50() {
  return (
    <div className="absolute content-stretch flex items-start justify-center left-[368px] top-[12px] w-[32px]" data-name="Container">
      <Button16 />
    </div>
  );
}

function Container48() {
  return (
    <div className="bg-white h-[52px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[16px] not-italic text-[#99a1af] text-[12px] top-[18px] whitespace-nowrap">7</p>
        <p className="[word-break:break-word] absolute font-['Consolas:Regular',sans-serif] leading-[16px] left-[48px] not-italic text-[#4a5565] text-[12px] top-[18px] whitespace-nowrap">B2303860</p>
        <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[144px] not-italic text-[#1e2939] text-[12px] top-[18.5px] whitespace-nowrap">Trần Văn Bình</p>
        <Container49 />
        <Container50 />
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container30 />
        <Container33 />
        <Container36 />
        <Container39 />
        <Container42 />
        <Container45 />
        <Container48 />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[513.667px] items-start overflow-clip relative rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container">
      <Container24 />
      <Container28 />
      <Container29 />
    </div>
  );
}

function ContainerMargin5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <Container23 />
      </div>
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p32ddfd00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.08333" />
        </g>
      </svg>
    </div>
  );
}

function Button17() {
  return (
    <div className="bg-gradient-to-r content-stretch drop-shadow-[0px_10px_7.5px_#b9f8cf,0px_4px_3px_#b9f8cf] flex from-[#00c950] gap-[8px] h-[56px] items-center justify-center py-[16px] relative rounded-[16px] shrink-0 to-[#05df72] w-[416px]" data-name="Button">
      <Icon16 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">Lưu điểm danh</p>
    </div>
  );
}

function ButtonMargin() {
  return (
    <div className="relative shrink-0" data-name="Button:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <Button17 />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="flex-[832.333_0_0] min-h-px relative w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[24px] px-[16px] relative size-full">
        <Container19 />
        <ContainerMargin4 />
        <ContainerMargin5 />
        <ButtonMargin />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start max-w-[448px] relative shrink-0 w-[448px]" data-name="Container">
      <Header />
      <Container10 />
      <Container18 />
    </div>
  );
}

function ContainerMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <Container />
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="bg-[#f9fafb] h-[1202px] relative shrink-0 w-[1322px]" data-name="App">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <ContainerMargin />
      </div>
    </div>
  );
}

export default function GenerateWireframeDesign() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="Generate wireframe design">
      <App />
    </div>
  );
}