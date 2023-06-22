import { Meta } from '@/layouts/Meta'
import { Main } from '@/templates/Main'

//import beachImg from '@/public/assets/images/blue-beach.png'

const Hello = () => {

    return <Main meta={<Meta title="VReRV - Hello" description="Main site" />}>
      <section id="hello" className="bg-bg-50 dark:bg-bg-900 py-12 h-60 md:h-72 items-center hover:bg-purple-500 transition duration-300 ease-in-out transform0">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">브레브에 오신것을 환영합니다.</h1>
          <p className="mb-8 text-lg md:text-xl">"브레브" 나의 인생아! 성공을 위한 파트너!</p>
          {/*
                  <a href="#about" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">더 알아보기</a>
                  */}
        </div>
      </section>
      <section id="about" className="bg-bg-100 dark:bg-bg-800 py-12 max-h-full items-center pt-16 transition duration-300 ease-in-out transform">
      {/*
          bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${beachImg.src})` }}>
          */}
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">브레브에 대하여</h2>
          <p className="mb-8 text-lg md:text-xl">
            브레브는 IT 세상에서 더 효율적인 방법을 찾습니다.<br/>
            기술을 더 많은 사람들이 사용할 수 있는 방법을 찾습니다.<br/>
            인공지능이 모두에게 도움이 되는 방법을 찾고 싶습니다.<br/>
            브레브! 성공한 당신을 위하여!
          </p>
        </div>
      </section>
      {/*
          <section id="services" className="bg-gray-100 py-0 h-96 items-center pt-16
           transition duration-300 ease-in-out transform
           bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${beachImg})` }}>
              <div className="container mx-auto px-4">
                  <h2 className="text-3xl font-bold mb-4">준비중인 서비스</h2>
                  <ul className="list-disc pl-4">
                      <li>마인드맵 태스크 관리</li>
                      <li>스몰팀 문서 관리</li>
                      <li>개발자 구독 서비스</li>
                      <li>스터디 채팅</li>
                  </ul>
              </div>
          </section>
          <section id="contact" className="bg-gray-200 py-12 h-screen items-center pt-16">
              <div className="container mx-auto px-4">
                  <h2 className="text-3xl font-bold mb-4">문의하기</h2>
                  <form className="mb-8">
                      <div className="mb-4">
                          <label className="block text-gray-700 font-bold mb-2" htmlFor="name">이름:</label>
                          <input className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Enter your name"/>
                      </div>
                      <div className="mb-4">
                          <label className="block text-gray-700 font-bold mb-2" htmlFor="email">이메일:</label>
                          <input className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Enter your email"/>
                      </div>
                      <div className="mb-4">
                          <label className="block text-gray-700 font-bold mb-2" htmlFor="message">메세지:</label>
                          <textarea className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="message" placeholder="Enter your message"></textarea>
                      </div>
                  </form>
              </div>
          </section>
          */}
    </Main>
}

export default Hello