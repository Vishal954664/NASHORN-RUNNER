import javax.script.*;

public class MyNashornRunner {
  public static void main(String[] args) throws Exception {
    if (args.length < 3) {
      System.out.println("Usage: MyNashornRunner <script.js> <functionName> <jsonParams>");
      return;
    }

    String scriptFile = args[0];
    String functionName = args[1];
    String jsonParams = args[2];

    ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");
    engine.eval(new java.io.FileReader(scriptFile));

    Invocable invocable = (Invocable) engine;

    Object parsed = engine.eval("Java.asJSONCompatible(" + jsonParams + ")");

    Object result;

    if (parsed instanceof java.util.List) {
      java.util.List<?> list = (java.util.List<?>) parsed;
      result = invocable.invokeFunction(functionName, list.toArray());
    } else {
      result = invocable.invokeFunction(functionName, parsed);
    }

    System.out.println(result);
  }
}
