import svgPaths from "./svg-0ch0fcrt0i";
import imgContainer from "./97e3160c170c3b0c0e2ef6fc17335bd1e23871d5.png";

function Container2() {
  return (
    <div className="relative rounded-[16px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] shrink-0 size-[80px]" data-name="Container">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgContainer} />
    </div>
  );
}

function ContainerMargin() {
  return (
    <div className="relative shrink-0" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[16px] relative size-full">
        <Container2 />
      </div>
    </div>
  );
}

function ParagraphMargin() {
  return (
    <div className="relative shrink-0" data-name="Paragraph:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#bedbff] text-[14px] whitespace-nowrap">Hệ thống điểm danh thông minh</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[184px] relative shrink-0 w-[283px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pb-[32px] relative size-full">
        <ContainerMargin />
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[32px] not-italic relative shrink-0 text-[24px] text-white tracking-[0.6px] whitespace-nowrap">CTU-SmartAttendance</p>
        <ParagraphMargin />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[#1e2939] text-[20px] whitespace-nowrap">Đăng nhập</p>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[24px] relative shrink-0 w-[320px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6a7282] text-[14px] whitespace-nowrap">Dành cho Giảng viên CTU</p>
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="relative shrink-0 w-full" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#364153] text-[14px] whitespace-nowrap">Email</p>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p1b122e80} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p17a68100} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[14px] top-[13.67px]" data-name="Container">
      <Icon />
    </div>
  );
}

function EmailInput() {
  return (
    <div className="absolute bg-[#f9fafb] h-[45.333px] left-0 rounded-[14px] top-0 w-[320px]" data-name="Email Input">
      <div className="content-stretch flex flex-col items-start justify-center overflow-clip pl-[40.667px] pr-[16.667px] py-[12.667px] relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#99a1af] text-[14px] w-full">gv001@ctu.edu.vn</p>
      </div>
      <div aria-hidden className="absolute border-[#e5e7eb] border-[0.667px] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[45.333px] relative shrink-0 w-full" data-name="Container">
      <Container6 />
      <EmailInput />
    </div>
  );
}

function ContainerMargin1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[6px] relative size-full">
        <Container5 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Label />
        <ContainerMargin1 />
      </div>
    </div>
  );
}

function Label1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#364153] text-[14px] whitespace-nowrap">Mật khẩu</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p2ebe100} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p160f9700} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[14px] top-[13.67px]" data-name="Container">
      <Icon1 />
    </div>
  );
}

function PasswordInput() {
  return (
    <div className="absolute bg-[#f9fafb] h-[45.333px] left-0 rounded-[14px] top-0 w-[320px]" data-name="Password Input">
      <div className="content-stretch flex flex-col items-start justify-center overflow-clip pl-[40.667px] pr-[44.667px] py-[12.667px] relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#99a1af] text-[14px] w-full">••••••••</p>
      </div>
      <div aria-hidden className="absolute border-[#e5e7eb] border-[0.667px] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p2f0f2f00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p254f3200} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex flex-col items-start justify-center left-[288px] top-[13.67px]" data-name="Button">
      <Icon2 />
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[45.333px] relative shrink-0 w-full" data-name="Container">
      <Container9 />
      <PasswordInput />
      <Button />
    </div>
  );
}

function ContainerMargin2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[6px] relative size-full">
        <Container8 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0 w-[320px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[16px] relative size-full">
        <Label1 />
        <ContainerMargin2 />
      </div>
    </div>
  );
}

function Container10() {
  return <div className="h-[48px] relative shrink-0 w-[320px]" data-name="Container" />;
}

function Button1() {
  return (
    <div className="bg-gradient-to-r drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1),0px_2px_2px_rgba(0,0,0,0.1)] from-[#155dfc] h-[52px] relative rounded-[14px] shrink-0 to-[#2b7fff] w-full" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-[160.07px] not-italic text-[16px] text-center text-white top-[12.33px] whitespace-nowrap">Đăng nhập</p>
      </div>
    </div>
  );
}

function Form() {
  return (
    <div className="relative shrink-0 w-[320px]" data-name="Form">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[24px] relative size-full">
        <Container4 />
        <Container7 />
        <Container10 />
        <Button1 />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-white drop-shadow-[0px_25px_25px_rgba(0,0,0,0.25)] max-w-[384px] relative rounded-[24px] shrink-0 w-[384px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start max-w-[inherit] p-[32px] relative size-full">
        <Heading />
        <Paragraph />
        <Form />
      </div>
    </div>
  );
}

function ParagraphMargin1() {
  return (
    <div className="relative shrink-0" data-name="Paragraph:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[24px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#bedbff] text-[12px] whitespace-nowrap">Đại học Cần Thơ © 2026</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[871.333px] max-w-[448px] relative shrink-0 w-[448px]" style={{ backgroundImage: "linear-gradient(117.21deg, rgb(20, 71, 230) 0%, rgb(21, 93, 252) 50%, rgb(43, 127, 255) 100%)" }} data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center max-w-[inherit] p-[24px] relative size-full">
        <Container1 />
        <Container3 />
        <ParagraphMargin1 />
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="bg-[#f9fafb] h-[871.333px] relative shrink-0 w-[1322px]" data-name="App">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center overflow-clip relative rounded-[inherit] size-full">
        <Container />
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