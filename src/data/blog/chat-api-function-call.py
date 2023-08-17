import openai
import json


# 항상 같은 날씨를 리턴하는 더미 함수의 예, 운영에서는
# 백엔드 API 또는 외부 API를 호출하는 코드가 될 수 있다.
def get_current_weather(location, unit="fahrenheit"):
    """Get the current weather in a given location"""
    weather_info = {
        "location": location,
        "temperature": "72",
        "unit": unit,
        "forecast": ["sunny", "windy"],
    }
    return json.dumps(weather_info)


def run_conversation():
    # 1 단계: 대화목록과 사용가능한 함수 목록을 GPT 에 전송
    messages = [{"role": "user", "content": "What's the weather like in Boston?"}]
    functions = [
        {
            "name": "get_current_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA",
                    },
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
                },
                "required": ["location"],
            },
        }
    ]
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-0613",
        messages=messages,
        functions=functions,
        function_call="auto",  # 'auto' 가 기본값이지만, 명확히 하기 위해 설정
    )
    response_message = response["choices"][0]["message"]

    # 단계 2: GPT 가 함수를 호출하길 원하는지 확인
    if response_message.get("function_call"):
        # 단계 3: 함수 호출
        # 노트: JSON 응답이 항상 유효하지 않을 수 있으므로 오류를 처리하도록 한다.
        print("함수 호출 응답 메세지:", response_message)
        available_functions = {
            "get_current_weather": get_current_weather,
        } # 이 예제에서 함수가 하나만 있지만, 여러개를 넣을 수도 있다.
        function_name = response_message["function_call"]["name"]
        fuction_to_call = available_functions[function_name]
        function_args = json.loads(response_message["function_call"]["arguments"])
        function_response = fuction_to_call(
            location=function_args.get("location"),
            unit=function_args.get("unit"),
        )

        # 단계 4: 함수 호출한 응답을 메세지에 추가하여 GPT 에 전송
        messages.append(response_message) # GPT 응답의 대화를 확장
        messages.append(
            {
                "role": "function",
                "name": function_name,
                "content": function_response,
            }
        ) # 함수 응답으로 대화를 확장
        second_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-0613",
            messages=messages,
        ) # 추가된 함수응답을 확인한 GPT 로 부터 새응답을 받는다.
        return second_response


print("최종 응답: ", run_conversation())