package cyou.sk5s.app.countdate;

import androidx.appcompat.app.AppCompatActivity;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.RemoteViews;
import android.widget.SimpleAdapter;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;

public class CountdateWidgetConfig extends AppCompatActivity {
    public static final String SHARED_PREFS = "CapacitorStorage";
    public static final String KEY_NAME_PREFIX = "countdateName";
    public static final String KEY_DATE_PREFIX = "countdateDate";

    private int appWidgetId = AppWidgetManager.INVALID_APPWIDGET_ID;
    private EditText editTextButton;

    public static final String KEY_DATA = "countdate_events_data";
    ArrayList<HashMap<String,String>> eventsList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_countdate_widget_config);

        Intent configIntent = getIntent();
        Bundle extras = configIntent.getExtras();
        if (extras != null){
            appWidgetId = extras.getInt(AppWidgetManager.EXTRA_APPWIDGET_ID, AppWidgetManager.INVALID_APPWIDGET_ID);
        }
        Intent resultValue = new Intent();
        resultValue.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
        setResult(RESULT_CANCELED, resultValue);
        if (appWidgetId == AppWidgetManager.INVALID_APPWIDGET_ID){
            finish();
        }
        //editTextButton = findViewById(R.id.edit_text_button);

        // Read countdates
        eventsList = new ArrayList<>();
        ListView listview = findViewById(R.id.listview);
        SharedPreferences prefs = getSharedPreferences(SHARED_PREFS, MODE_PRIVATE);
        String strJson = prefs.getString(KEY_DATA,null);
        if (strJson != null) {
            try {
                JSONArray response = new JSONArray(strJson);
                for (int x = 0; x < response.length(); x++){
                    JSONObject eventObj = response.getJSONObject(x);
                    String eventName = eventObj.getString("event_name");
                    String eventDate = eventObj.getString("date");

                    HashMap<String,String> event = new HashMap<>();
                    event.put("name",eventName);
                    event.put("date",eventDate);

                    eventsList.add(event);
                }
                if (response.length() == 0){
                    HashMap<String,String> event = new HashMap<>();
                    event.put("name","No data");
                    event.put("date","No data");

                    eventsList.add(event);
                }
            } catch (JSONException e) {

            }
        }else{
            HashMap<String,String> event = new HashMap<>();
            event.put("name","No data");
            event.put("date","No data");

            eventsList.add(event);
        }
        ListAdapter adapter = new SimpleAdapter(CountdateWidgetConfig.this,eventsList,R.layout.row_layout,new String[]{"name","date"},new int[]{R.id.textView,R.id.textView2});
        listview.setAdapter(adapter);
        listview.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {
                confirmConfig(position);
            }
        });
    }
    public void confirmConfig(int position){
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(this);
        Intent intent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, 0);

        //String buttonText = editTextButton.getText().toString();
        String eventName = eventsList.get(position).get("name");
        String eventDate = eventsList.get(position).get("date");

        RemoteViews views = new RemoteViews(this.getPackageName(), R.layout.countdate_widget);
        //views.setOnClickPendingIntent(R.id.countdate_widget_text1,pendingIntent);
        views.setOnClickPendingIntent(R.id.countdate_widget_text2,pendingIntent);

        String numOfDays = "";
        String countdownup = "Countdown";
        String[] parts = eventDate.split("T");
        numOfDays = "";
        try {
            Date today = new Date();
            Date anotherDate = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).parse(parts[0]);
            //numOfDays = String.valueOf(today.getTime()) + String.valueOf(anotherDate.getTime());
            if (anotherDate.getTime() > 0){
                long difference = anotherDate.getTime() - today.getTime();
                if (difference > 0){
                    numOfDays = String.valueOf((int) (difference / (1000 * 60 * 60 * 24)) + 1);
                } else {
                    numOfDays = String.valueOf((int) (-difference / (1000 * 60 * 60 * 24)) - 1);
                    countdownup = "Countup";
                }
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }

        views.setCharSequence(R.id.countdate_widget_text1, "setText", eventName+" "+countdownup);
        views.setCharSequence(R.id.countdate_widget_text2, "setText", numOfDays);
        //views.setInt(R.id.countdate_widget_text1,"setBackgroundColor", Color.RED);

        appWidgetManager.updateAppWidget(appWidgetId, views);

        SharedPreferences prefs = getSharedPreferences(SHARED_PREFS, MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString(KEY_NAME_PREFIX + appWidgetId, eventName);
        editor.putString(KEY_DATE_PREFIX + appWidgetId, eventDate);
        editor.apply();
        Intent resultValue = new Intent();
        resultValue.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
        setResult(RESULT_OK, resultValue);
        finish();
    }
}